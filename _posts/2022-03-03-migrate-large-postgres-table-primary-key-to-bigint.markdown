---
layout: post
title:  Migrate large PostgreSQL table primary key to bigint
date:   2022-03-03 08:00:00 -0500
categories: postgresql
---

I recently took on a difficult data migration task that was new to me. I learned quite a bit along the way and wanted to share what I learned here.

## The situation

In PostgreSQL there are [several different numeric data types](https://www.postgresql.org/docs/12/datatype-numeric.html). If we have a table with `integer` as the primary key type, then auto-incrementing this key when creating new records will reach an integer overflow after 2,147,483,647 or about 2.1 billion rows. For a table that gets new records very often this can become a problem quickly. Even deleting old rows won't help unless we want to try to reuse primary keys which is dangerous.

Luckily, PostgreSQL offers us another data type called `bigint` that doubles the storage size from 4 bytes to 8 and will allow IDs up to 9,223,372,036,854,775,807 or about 9 quintillion rows. If our database is approaching that size we likely have bigger problems 😅.

Name |	Storage Size |	Range
-|-|-
smallint | 2 bytes | -32768 to +32767
integer | 4 bytes | -2147483648 to +2147483647
bigint | 8 bytes | -9223372036854775808 to +9223372036854775807

So now we just need to change the data type for the primary key column and any foreign key columns on other tables.

Since the database we need to modify is a production database with 24/7 activity that generates revenue for the company we need to keep it up and running as much as possible. This means we need to really minimize any downtime.

### Requirements

- Minimize application downtime
- Avoid application code changes

## What won't work

```sql
ALTER TABLE big_table ALTER COLUMN id TYPE bigint;
```

With over 200 million rows this could take hours depending on other traffic to the database and other factors such as disk write speed. During that time all reads and writes to the table are blocked.

Since this table is a core part of our business, this is not a good approach as it would likely cost us a significant amount of lost revenue.

## Moving in stages

In order to minimize downtime we can take a phased approach.

1. Add new columns
2. Synchronize new columns with old
3. Build new indexes concurrently
4. Move and recreate constraints using the new indexes

All but the the last step can be done without any downtime. The last step should be much faster than the alter column statement since there is much less for the server to write.

## Synchronizing the old and the new

Once we add new `id_bigint` and `big_table_id_bigint` columns, we need to ensure they are populated with correct IDs for new and existing records.

### New records

With new records we want the new ID columns to be set automatically like the old columns are by the sequences in the database. We can create database functions and triggers to handle this for us.

```sql
-- Set new primary key to the value of the old primary key
CREATE OR REPLACE FUNCTION populate_big_table_id_bigint()
  RETURNS trigger AS $$
  BEGIN
    new.id_bigint := new.id;
      RETURN new;
  END;
    $$ LANGUAGE plpgsql;
```

```sql
-- Set new foreign key to the value of the old foreign key
CREATE OR REPLACE FUNCTION populate_other_table_big_table_id_bigint()
  RETURNS trigger AS $$
  BEGIN
    IF new.big_table_id IS NOT NULL THEN
      new.big_table_id_bigint := new.big_table_id;
    END IF;

    RETURN new;
  END;
    $$ LANGUAGE plpgsql;
```

These functions can be triggered automatically. For the primary key we only need to do this before insert but for our foreign key we need to do this at insert or update because in this table the foreign key is optional.

```sql
CREATE TRIGGER populate_big_table_id_bigint_trigger
  BEFORE INSERT ON big_table
  FOR EACH ROW
  EXECUTE FUNCTION populate_big_table_id_bigint();

CREATE TRIGGER populate_other_table_big_table_id_bigint_trigger
  BEFORE INSERT OR UPDATE ON other_table
  FOR EACH ROW
  EXECUTE FUNCTION populate_other_table_big_table_id_bigint();
```

### Existing records

Once new records are getting the IDs set properly, we need to go back and fill in existing records. We can do this for existing records with bulk update statements.

We're using Ruby on Rails so I wrote a class that we can use with different tables and columns. I had a few considerations when writing this:

 - Avoid overwhelming the database with non-stop writes
 - Be able to efficiently resume when timeouts occur

I achieved the first part by only updating 10,000 records at a time and adding a pause of 1/10th of a second between updates.

Efficiently resuming proved to be more challenging. Since the new column is not yet indexed, searching the last ID value can be quite slow. To solve this I opted to do a few queries with a range of IDs in a binary search loop. This proved to be very effective even after updating hundreds of thousands of records.

```rb
module HouseKeeping
  ##
  # Set id_bigint = id so we can
  # transition the primary key from int to bigint
  #
  class IdBigintSetter
    BATCH_SIZE = 10_000

    attr_reader :klass

    ##
    # +klass+ should be the model class name
    #
    def initialize(klass)
      @klass = klass
    end

    def call(column_name: :id)
      column_name_bigint = "#{column_name}_bigint"
      num_batches_processed = 0

      first_id = klass.minimum(:id)
      last_id = klass.maximum(:id)

      # Since our bigint column is likely not indexed the database would do a sequential scan here so if we've already
      # updated a large portion of records then finding the next one that needs updating could take a long time to find.
      # Instead, we use Ruby to do a binary search in find-minimum mode.
      start_id = (first_id..last_id).bsearch do |id|
        klass.where(id: id..(id + BATCH_SIZE), column_name_bigint => nil).exists?
      end
      return num_batches_processed if start_id.blank?

      while start_id <= last_id
        klass.where(column_name_bigint => nil, id: start_id..(start_id + BATCH_SIZE))
             .update_all("#{column_name_bigint} = #{column_name}")

        num_batches_processed += 1
        start_id += BATCH_SIZE
        Rails.logger.info("Updated #{klass.name} #{column_name_bigint} for ID: #{start_id}-#{start_id + BATCH_SIZE} of #{last_id}")
        sleep(0.1) # Give the database a little space
      end

      num_batches_processed
    end
  end
end
```

Then we can call the classes in a Rails console or create a Rake task.

```rb
HouseKeeping::IdBigintSetter.new(BigTable).call
HouseKeeping::IdBigintSetter.new(OtherTable).call(column_name: :big_table_id)
```

## Indexes

Aside from populating IDs for existing records, the next most time-consuming part of this was rebuilding indexes for the new keys. Luckily, PostgreSQL offers the option to create indexes concurrently while other work is allowed to continue uninterrupted. It also allows us to recreate primary and foreign key constraints using an existing index. This will dramatically reduce the amount of time needed to lock the tables during the transition.

We also need to make sure to rebuild any indexes that include the primiary or foreign keys.

## Testing with real data

In order to get some realistic time estimates we decided to download the real tables from production and import to my laptop. Due to references across tables we had to retrieve more than just the two tables we needed to update.

```
➜ time pg_dump -Fc --no-privileges --file prod_tables.dump \
    --table other_table --table big_table \
    --table another_table --table some_table \
    postgres://...

4692.59s user 568.05s system 41% cpu 3:29:02.80 total
```

As you can see this took about 3.5 hours to download and took up 46 GB of space on my laptop compressed.

Importing was even more difficult. I quickly ran out of disk space and clashed with existing data in my local database. I had to move all non-essential files to an external drive and drop these conflicting tables. After import, my local database was quite large.

```
323G	/usr/local/var/postgresql@12
```

## Migration time

### Phase I

1. Add id_bigint and big_table_id_bigint columns
2. Add database functions
3. Add before insert triggers

_~ 76 minutes with no user impact_

### Phase II

Bulk update existing records in batches

_Ran for hours overnight and had to be restarted multiple times but had no user impact_

### Phase III

Create temporary unique index for new primary key

_~ 81 min with no user impact_

### Phase IV

In a single transaction:

```sql
-- Drop foreign key constraints
ALTER TABLE other_table DROP CONSTRAINT IF EXISTS new_instances_of_other_table_big_table_id_fk;
-- Recreate ID sequence and drop the id_bigint=id trigger
DROP SEQUENCE big_table_id_seq CASCADE;
DROP TRIGGER populate_big_table_id_bigint_trigger on big_table;
CREATE SEQUENCE big_table_id_seq;
SELECT setval('big_table_id_seq',  (SELECT MAX(id) + 1 FROM big_table));
ALTER TABLE big_table ALTER COLUMN id_bigint SET DEFAULT NEXTVAL('big_table_id_seq');
-- Rename ID columns
ALTER TABLE big_table RENAME id TO id_old;
ALTER TABLE big_table RENAME id_bigint TO id;
-- Drop foreign key trigger(s)
DROP TRIGGER IF EXISTS populate_other_table_big_table_id_bigint_trigger ON other_table;
-- Rename foreign keys
ALTER TABLE other_table RENAME big_table_id TO big_table_id_old;
ALTER TABLE other_table RENAME big_table_id_bigint TO big_table_id;
-- Recreate a primary key constraint
ALTER TABLE big_table DROP CONSTRAINT big_table_pkey,
  ADD CONSTRAINT big_table_pkey PRIMARY KEY USING INDEX big_table_id_temp_idx;
-- Add back foreign key constraints with the least impact on other work
ALTER TABLE other_table ADD CONSTRAINT new_instances_of_other_table_big_table_id_fk
  FOREIGN KEY (big_table_id) REFERENCES big_table (id) NOT VALID;
ALTER TABLE other_table VALIDATE CONSTRAINT new_instances_of_other_table_big_table_id_fk;
-- Remove not null for old ID columns
ALTER TABLE big_table ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE other_table ALTER COLUMN big_table_id_old DROP NOT NULL;
```

_~ 46 min with big_table and other_table locked for reads/writes_

While we ran the last phase around midnight when regular activity was lowest and our app was put into maintenance mode, there was still some other load on our database that we did not immediately notice and were unable to stop quick enough. If we had, I believe this would have taken half the time.

## Final thoughts

This was a great learning experience for myself. I had never written database functions before or organized such as complex migration. I learned about awesome features in PostgreSQL such as adding constraints using an index. I also found a good use for binary search.

While we did build the new primary key index concurrently before the final cut over, we didn't do that for the foreign key column. I did use something suggested in the PostgreSQL documentation:

```sql
-- Add back foreign key constraints with the least impact on other work
ALTER TABLE other_table ADD CONSTRAINT new_instances_of_other_table_big_table_id_fk
  FOREIGN KEY (big_table_id) REFERENCES big_table (id) NOT VALID;
ALTER TABLE other_table VALIDATE CONSTRAINT new_instances_of_other_table_big_table_id_fk;
```

The problem was that I did this in a single transaction so reads and writes were blocked. I wanted all of these commands to succeed or nothing. If I had to do it again I think I would create another index concurrently for the foreign key and add the constraint back using that index like we did for the primary key.

Other traffic on the database really should be down to zero. That will minimize the time to make these updates and get our application back up and running as soon as possible.
