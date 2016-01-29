---
layout: post
title:  "NYC Farmers Market CLI Gem"
date:   2016-01-29 12:55:00 -0500
categories: jekyll update
---
So I have build my first Ruby gem! It is a wrapper for the [NYC Farmers Market API][nyc-farmers-market-api].

This project was part of the [Learn Verified Full Stack Web Development][learn-verified] track I am taking through the Flatiron School. It has been a great learning experience as I've had to tackle many new fronts such as creating this blog with [GitHub Pages][github-pages] and [Jekyll][jekyll]. Seema helped figure out that I need `master` and `gh-pages` branches on this repository for this site in order for it to be live. Who knew?! Thank you Seema!

Ok...back to my new gem. So there I was, tasked with magically crafting a Ruby gem that would sort out some information from a web page or an API. I currently live in NYC and am aware that is information available about the city in the from of various APIs. I did [a lab][working-with-apis-codealong] that showed me how to parse info from a JSON file. I also did some labs that involved scraping web pages, but I understand that web pages are more likely to change than public APIs, so I decided to seek out an API that provided a JSON file.

I searched through [NYC Open Data][nyc-open-data] looking for something that interested me. I ran across a few things peeked my interest but many of them were quite large and/or full of inconsistent data such as location information in the year key...go figure?! I then stumbled upon a nice set of data about farmers markets with most data intact! Eureka!

I had to research a variety of tools to help get this job done. I used the structure of dannyd4315's [Worlds Best Restaurants CLI Gem][wbr-cli-gem] and the [Make Your Own Gem][make-your-own-gems] guide from RubyGems.org as a jumping off point. I found tigris's [OpenURI with caching gem][open-uri-cached] that helped to reduce the number of times my gem had to contact the API. The [colorize gem][colorize] from fazibear helped to give my CLI some color and pop!

I used `open-uri-cached` and `JSON` to turn the `.json` file into a hash that I could work with:

{% highlight ruby %}
URL = "https://data.cityofnewyork.us/resource/cw3p-q2v6.json"

def get_markets
  content = open(URL).read
  markets = JSON.parse(content)
end
{% endhighlight %}

I created a `Market` class that I would make instances of for each market.

{% highlight ruby %}

class NYCFarmersMarkets::Market
  attr_accessor :name, :additional_info, :street_address, :borough, :state, :zipcode, :latitude, :longitude, :website

  @@all = []

  def initialize(name: nil, additional_info: nil, street_address: nil, borough: nil, state: "NY", zipcode: nil, website: nil)
    @name = name
    @additional_info = additional_info
    @street_address = street_address
    @borough = borough
    @state = state
    @zipcode = zipcode
  end
  # more methods...
{% endhighlight %}

I had some fun with regular expressions and [Rubular][rubular] while trying to extract websites from the `additional_info` keys and then get rid of the HTML that was making things messy.

I decided not to use the latitude and longitude keys since they were all the same values, but left the accessors in for future implementation.

Then I thought about how it might be best to let users search for markets. I decided to make methods and CLI commands to display all, list boroughs, display all markets in a borough, display all zip codes, and display all markets in a zip code. I made methods for each of these that iterated through an `#all` class method and return an array of market instances.

I built command-line interface that I tried to make friendly and easy to look at. I used a simply `loop do`, prompt, and `case` statement to handle this. I found a [blog post][case-testing-against-array] by Ben Gribaudo where I learned that I could test against an array of values! This was really helpful for checking if the user entered a zip code that had a market in it since I was working with 40+ zip codes!

To add more flare to my CLI, I investigated using Unicode symbols, and came across the [Ruby Output Unicode Character][ruby-output-unicode-char] post on Stack Overflow. By trial and error I discovered that I could encode my character directly into my variable! This made things much cleaner!

{% highlight ruby %}
vesta = "\u26B6".encode('utf-8')
flower = "\u2698".encode('utf-8')
puts "\n\t #{vesta} Welcome to the Farmers Markets of NYC #{vesta} ".green.underline
print "\t"; 15.times { print "#{flower}  ".light_blue }; puts ""
{% endhighlight %}

I spent a good deal of time testing my CLI and looking for places to clean up my code. I remembered the mantra "commit early and often" and so I did! I have 18 commits as of the writing of this post. I tried to use `\n` for new lines and `\t` for tabs instead of using `puts ""` or `puts "    "` where I could. I tried to move my fancy printing code to methods instead of having that done right in the `case` statement to keep that as dry as possible. I started by displaying the possible commands at every run of my loop but then realized that was too messy as I added commands so I moved that to a help command and the `puts` code to it's own method.

I really learned quite a lot here and it was really fun! I am next going to work on getting my gem published and making a walkthrough video. I will post the video here when it's live. 

[nyc-farmers-market-api]: https://dev.socrata.com/foundry/data.cityofnewyork.us/cw3p-q2v6
[learn-verified]: https://learn.co/verified
[github-pages]: https://pages.github.com/
[jekyll]: https://jekyllrb.com/
[nyc-open-data]: https://nycopendata.socrata.com/
[working-with-apis-codealong]: https://github.com/HarlemSquirrel/code-along-working-with-apis-teacher-fellowship-1015
[wbr-cli-gem]: https://github.com/dannyd4315/worlds-best-restaurants-cli-gem
[make-your-own-gems]: http://guides.rubygems.org/make-your-own-gem/
[open-uri-cached]: https://github.com/tigris/open-uri-cached
[colorize]: https://github.com/fazibear/colorize
[rubular]: http://rubular.com/
[case-testing-against-array]: http://www.bengribaudo.com/blog/2013/12/31/2530/ruby-case-testing-against-arrays-of-values
[ruby-output-unicode-char]: http://stackoverflow.com/questions/18492664/ruby-output-unicode-character
