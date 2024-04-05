---
layout: post
title:  Find where a Ruby method is defined
date:   2024-04-05 08:00:00 -0500
categories: ruby
---

Sometimes we want to peek behind the curtain and see what a method in Ruby is doing. It can be tough to search in a large code base. The method might be defined dynamically or be in a gem.

To save ourselves a lot of time and digging, we can use [`Method#source_location`](https://ruby-doc.org/3.2.2/Method.html#method-i-source_location).

Here's an example in a Rails project from the Rails console:

```rb
pry(main)> User.method(:create).source_location
[
  [0] "/home/myuser/.rvm/gems/ruby-3.2.3/gems/activerecord-7.0.8.1/lib/active_record/persistence.rb",
  [1] 33
]
```

We could even output the first 10 lines like this:

```rb
pry(main)> source_info = User.method(:create).source_location
pry(main)> puts File.readlines(source_info[0]).slice((source_info[1]-1)..source_info[1]+10)
      def create(attributes = nil, &block)
        if attributes.is_a?(Array)
          attributes.collect { |attr| create(attr, &block) }
        else
          object = new(attributes, &block)
          object.save
          object
        end
      end

      # Creates an object (or multiple objects) and saves it to the database,
      # if validations pass. Raises a RecordInvalid error if validations fail,
```

But it is likely easier and nicer to open the file in our default text editor.

```rb
pry(main)> `open #{source_info[0]}`
```

Or if we are already in a VS Code terminal, we can open the file in the same window:

```rb
pry(main)> `code -r #{source_info[0]}`
```

Alternatively, we could use the mouse and click on the file path in the VS Code terminal while holding Control (Linux/Windows) or Command (MacOS).
