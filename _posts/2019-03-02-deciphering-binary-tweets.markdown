---
layout: post
title:  Deciphering Binary Tweets
date:   2019-03-02 01:00:00 -0500
categories: ruby
---

Last week, Twitter tweeted the following:

<blockquote class="twitter-tweet" data-lang="en"><p lang="und" dir="ltr">01001000 01100101 01110010 01100101 00100111 01110011 00100000 01110100 01101111 00100000 01100001 00100000 01100100 01100101 01100011 01100001 01100100 01100101 00100000 01101111 01100110 00100000 01010100 01110111 01100101 01100101 01110100 01110011</p>&mdash; Twitter (@Twitter) <a href="https://twitter.com/Twitter/status/1100187858126733317?ref_src=twsrc%5Etfw">February 26, 2019</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

But unless you are a accustomed to reading binary, you might not know what this said.

Lucky, Ruby can help us decipher the message.

We can see that there are groups of eight 0's and 1's. Each of these is a byte of data with 2^8 or 256 possible combinations. With Ruby we can change letters into bytes.

```ruby
'a'.bytes
# => [97]
'Ruby'.bytes
# => [82, 117, 98, 121]
```

In order to make sense of the bytes above, we need to first separate our message.

```ruby
binary_text = <<~TEXT.gsub(/\s/, ' ').strip
  01001000 01100101 01110010 01100101 00100111 01110011 00100000 01110100 01101111 00100000 01100001
  00100000 01100100 01100101 01100011 01100001 01100100 01100101 00100000 01101111 01100110 00100000
  01010100 01110111 01100101 01100101 01110100 01110011
TEXT

binary_text.split(' ')
# => ["01001000", "01100101", "01110010", "01100101", "00100111", "01110011", "00100000", "01110100", "01101111", "00100000", "01100001", "00100000", "01100100", "01100101", "01100011", "01100001", "01100100", "01100101", "00100000", "01101111", "01100110", "00100000", "01010100", "01110111", "01100101", "01100101", "01110100", "01110011"]
```

Let's begin with the first byte. Ruby can convert strings into integers using [`String#to_i`](http://ruby-doc.org/core-2.6.1/String.html#method-i-to_i) by specifying the base. In this case, the base is 2.

```ruby
"01001000".to_i(2)
# => 72
```

Now we can use [`Integer#to_char`](https://ruby-doc.org/core-2.6.1/Integer.html#method-i-chr) to return the character represented by the integer's value according to the encoding we specify. In this case, ASCII or UTF-8 will work.

```ruby
"01001000".to_i(2).chr('ascii')
# => "H"
```

Now we are ready to loop through the bytes.

```ruby
binary_text.split(' ').map { |byte| byte.to_i(2).chr(Encoding::UTF_8) }
 => ["H", "e", "r", "e", "'", "s", " ", "t", "o", " ", "a", " ", "d", "e", "c", "a", "d", "e", " ", "o", "f", " ", "T", "w", "e", "e", "t", "s"]
```

Lastly we join the character array.

```ruby
binary_text.split(' ').map { |bin| bin.to_i(2).chr(Encoding::UTF_8) }.join
# => "Here's to a decade of Tweets"
```

🍻
