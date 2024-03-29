---
layout: post
title:  Common Missteps with Rails Associations and Testing
date:   2022-12-08 08:00:00 -0500
categories: rails
---

I've seen some less-than stellar patterns around associations with Ruby on Rails especially when it comes to testing. These can make code more complex than necessary and make testing slower and/or more difficult.

## Foreign key validations

```rb
class Author < ApplicationRecord
  has_many :books
end

class Book < ApplicationRecord
  belongs_to :author

  validates :author_id, presence: true # Not needed!
end
```

The `belongs_to` association requires the "owner" (an author in this case) to be set by default so validating the presence of the foreign key is not needed.

```rb
class Book < ApplicationRecord
  belongs_to :author
end

book = Book.new
book.valid? # false
book.errors[:author] # [ "must exist" ]
```

_Why is this a problem?_

Primary keys are generated by the database at record creation. Building an object in memory and not persisting it to the database will mean the foreign key is not set so new unsaved objects will always be invalid if the owner is not yet created. Rails will create all associated records for us (as long as `autosave: false` is not set on the association).

```rb
book = Book.new(author: Author.new(name:), title:)
book.valid? # true
book.save # true
book.persisted? # true
book.author.persisted? # true
```

Read more about Rails associations in the official [guide](https://guides.rubyonrails.org/association_basics.html) and [docs](https://api.rubyonrails.org/v7.0/classes/ActiveRecord/Associations/ClassMethods.html)

## Unnecessary persisted records in unit tests

Now we know Rails will create associated records for us and validates required associations.

```rb
let(:book) { create(:book, title: "the hobbit  ") } # This could probably be build!

it "formats the title" do
  expect(book.title).to eq "The Hobbit"
end
```

The [`FactoryBot` library](https://github.com/thoughtbot/factory_bot/) is a popular and useful testing library for quickly creating test model objects in Rails test suites.

It provides two ways of generating new objects: `build` and `create`. The `build` method does not persist the record to the database and is similar to calling `Book.new`. The `create` method saves the record to the database like `Book.create`.

```rb
let(:book) { build(:book, title: "the hobbit  ") } # Only in memory

it "formats the title" do
  expect(book.title).to eq "The Hobbit"
end
```

Many unit tests are looking at Ruby methods that do not require data to be read from or written to the database. This includes most validations.

**Where possible, use `build()` to dramatically speed up test runs**. It can be tempting to just `create()` all the time since it Just Works&trade; but when we have thousands of examples to run this can really slow things down. This can also make us think about what can be done in memory before we ever touch the database.

## Explicit association creations in factories

Building test objects is only going to be faster if our factories are defined without explicitly creating associated records.

```rb
FactoryBot.define do
  factory :book do
    author { create(:author) } # We don't need to create here!
    title { "Through the Looking Glass" }
  end
```

FactoryBot is wise to associations so in most cases we can just pass in the name of the associated record.

```rb
FactoryBot.define do
  factory :book do
    author # FactoryBot will see the relationship on the Book model definition
    title { "Through the Looking Glass" }
  end
```

If we need to specify some different attributes for an association in a factory, we can do it like this:

```rb
FactoryBot.define do
  factory :book do
    author
    title { "Through the Looking Glass" }

    trait :by_tolkien do
      association :author, name: "J.R.R. Tolkien"
      title { "The Hobbit" }
    end
  end
```

Keep `create()` out of our factories to take advantage of in-memory only tests that skip database read/write requests.
