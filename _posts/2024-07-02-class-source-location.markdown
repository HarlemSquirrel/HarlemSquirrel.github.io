---
layout: post
title:  Find where a Ruby class is defined
date:   2024-07-02 08:00:00 -0500
categories: ruby
---

In an earlier post, I showed how to find the source location for a Ruby method. But maybe we need to see where a class is defined instead. We can do this with [`Module#const_source_location`](https://ruby-doc.org/3.2.2/Module.html#method-i-const_source_location).

We need to start with a defined constant. `Object` is the top level so this should generally work fine. Then we give it the class name as a string.

Here's an example in a Rails project from the Rails console:

```rb
pry(main)> Object.const_source_location('ActiveSupport::Notifications::Event')
[
  [0] "/home/myuser/.rvm/gems/ruby-3.2.3/gems/activesupport-7.0.8.4/lib/active_support/notifications/instrumenter.rb",
  [1] 58
]
```

We can put this together with the line number so we can ctrl-click from VS Code to open the file to that line.

```rb
Object.const_source_location('ActiveSupport::Notifications::Event').join(":")
"/home/myuser/.rvm/gems/ruby-3.2.3/gems/activesupport-7.0.8.4/lib/active_support/notifications/instrumenter.rb:58"
```

Alternatively, we could use the mouse and click on the file path in the VS Code terminal while holding Control (Linux/Windows) or Command (MacOS).

If we are in IRB, we can use `show_source`

```
➤  irb
3.2.3 :001 > require 'active_support'
true
3.2.3 :002 > show_source ActiveSupport::Notifications::Event

From: /home/myuser/.rvm/gems/ruby-3.2.3/gems/activesupport-7.0.8.4/lib/active_support/notifications/instrumenter.rb:58

    class Event
      attr_reader :name, :time, :end, :transaction_id, :children
      attr_accessor :payload

      def initialize(name, start, ending, transaction_id, payload)
        @name           = name
        @payload        = payload.dup
        @time           = start ? start.to_f * 1_000.0 : start
        @transaction_id = transaction_id
        @end            = ending ? ending.to_f * 1_000.0 : ending
        @children       = []
        @cpu_time_start = 0.0
        @cpu_time_finish = 0.0
        @allocation_count_start = 0
        @allocation_count_finish = 0
      end
...
```
