---
layout: post
title:  "IRB for Prying Eyes in Ruby 2.4"
date:   2017-02-10 10:13:00 -0500
categories: ruby
---

Back in the day we used [IRB][irb], or "interactive Ruby" for debugging. We could type or paste in code and have it evaluated right there. This was fine except when we started to include lots of libraries like Rails. This makes debugging with IRB impractical if not impossible.

Next, we had the wonderful gem known as [Pry][pry]. It has been an essential tool on the tool belt for Ruby developers. Pry has allowed us to stop our software exactly where we want to and poke around in hopes of identifying what has been driving us to drink before noon. We just dropped `binding.pry` where we needed it and ran our program. We then had access to all the classes and variables that our code would have access to at that line in our code.

With the release of Ruby 2.4 we now have `binding.irb` baked right in! Let's install using [RVM][rvm] and take her for a test drive!

```
$ rvm install 2.4.0 --default
```

Now we need some Ruby code to run.

```ruby
#!/usr/bin/env ruby
# irb-trial.rb

require 'irb'

random_num = rand 99
puts 'Welcome to binding.irb!'
binding.irb
```

Then we just run our little program from the command line.

```
$ ruby irb-trial.rb
Welcome to binding.irb!
2.4.0 :001 > random_num
 => 7
```

And there you have it!

[pry]: https://github.com/pry/pry
[irb]: http://ruby-doc.org/stdlib-2.3.3/libdoc/irb/rdoc/IRB.html
[rvm]: https://rvm.io/
