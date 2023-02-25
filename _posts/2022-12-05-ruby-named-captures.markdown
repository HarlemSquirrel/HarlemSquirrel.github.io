---
layout: post
title:  Named captures with Ruby
date:   2022-12-05 08:00:00 -0500
categories: ruby
---

A really nice feature available in Ruby regex (regular expessions) is named captures.

This allows us to extract matches from strings and access them like a hash. This is very handy when you want to get many pieces of data from a single string.

The pattern is to surround our `variable_name` like this:

```
?<variable_name>
```

We then follow this with the regex pattern this should match and wrap the whole thing in parentheses.

```
(?<variable_name>\d+)
```

Here's an example straight from the [docs](https://ruby-doc.org/3.1.3/MatchData.html):

```rb
url = 'https://docs.ruby-lang.org/en/2.5.0/MatchData.html'

# Working with named captures
m = url.match(%r{(?<version>[^/]+)/(?<module>[^/]+)\.html$})
m.captures                  # => ["2.5.0", "MatchData"]
m.named_captures            # => {"version"=>"2.5.0", "module"=>"MatchData"}
m[:version]                 # => "2.5.0"
m.values_at(:version, :module)
                            # => ["2.5.0", "MatchData"]
# Numerical indexes are working, too
m[1]                        # => "2.5.0"
m.values_at(1, 2)           # => ["2.5.0", "MatchData"]
```

We can extract parts of someone's name this way.

```rb
regex = %r{(?<first_name>\w+) (?<last_name>\w+)\Z}

"Jane Doe".match(regex)
#<MatchData "Jane Doe" first_name:"Jane" last_name:"Doe">
```

We can call `#match` on the string or on the regex.

```rb
regex.match("Bugs Bunny")
#<MatchData "Bugs Bunny" first_name:"Bugs" last_name:"Bunny">
```

This is only going to work as expected if we are confident in the string format.

```rb
"Gandalf the Gray".match(regex)
#<MatchData "the Gray" first_name:"the" last_name:"Gray">
```

We can modify the regex but we need to consider all the possible combinations we can to get the best results.

```rb
regex = %r{\A(?<first_name>\w+)(?<last_name>[\w\s]+)\z}
"Gandalf the Gray".match(regex)
#<MatchData "Gandalf the Gray" first_name:"Gandalf" last_name:" the Gray">
```
