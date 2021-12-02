---
layout: post
title:  Bulk Close GitHub Pull Requests with Ruby
date:   2021-12-01 08:00:00 -0500
categories: ruby
---

If you attend a coding boot camp as I did then you might have boat loads of stale pull requests sitting around from lessons and projects. I finished 5 years ago and had about 300 pull requests clogging up my GitHub [/pulls](https://github.com/pulls) page. I ignored them for years but today finally I decided to close them.

Doing this by hand is of course tedious and I am of course a programmer who's nature it is to avoid tedious tasks at all costs! This led me to dig into [Octokit](https://github.com/octokit/octokit.rb) and the [GitHub REST API](https://docs.github.com/en/rest).

## Finding the right endpoints

I knew all the pull requests were made in the same organization but different repositories. The issues and pull_requests GH API endpoints don't allow listing PRs like this so I needed to use the search endpoint.

The search endpoint accepts a query parameter with space separated arguments. The best way to find what I needed was to search using the website at https://github.com/search/advanced and take the text from the search box that's populated when filling in the form and running the search.

## Firing up Octokit

To authenticate as my user I generated a personal access token.

```rb
client = Octokit::Client.new(access_token: 'abc123')
```

The Octokit method for searching issues is [`#search_issues`](http://octokit.github.io/octokit.rb/Octokit/Client/Search.html#search_issues-instance_method).

```rb
client.search_issues('org:learn-co-students author:HarlemSquirrel state:open', sort: :created, order: :asc)
```

I wanted to also sort by create time so I could close them in the order I opened them.

There's also a handy `#close_pull_request` method for me! However, while the PR number is easily found in the search result items I also need the repo name which isn't returned by itself in the search response. I have to extract it from the website URL.

```rb
results.items.each do |pr_info|
  org_repo = pr_info.html_url.slice(%r{[^/]+/[^/]+(?=/pull)})
  client.close_pull_request(org_repo, pr_info.number)
end
```

## Limits

As I ran my little script with a bit of logging I found that I was only getting about 30 results at a time. Octokit has an auto-paging feature but when trying to use that I hit a rate limit with GitHub.

> 403 - You have exceeded a secondary rate limit. Please wait a few minutes before you try again

To get around this limit and free myself up to write this blog post 😏 I added a loop with a pause. I also noticed I had a few issues open that were not pull requests (yes--all pull requests are issues but not all issues are pull requests). I decided to just skip those.

```rb
loop do
  results = client.search_issues('org:learn-co-students author:HarlemSquirrel state:open', sort: :created, order: :asc)
  count = 0

  results.items.each do |pr_info|
    org_repo = pr_info.html_url.slice(%r{[^/]+/[^/]+(?=/pull)})
    next if org_repo.nil? # Probably an issue and not a pull request.

    client.close_pull_request(org_repo, pr_info.number)
    count += 1
  end

  break if count.zero?

  puts "Pausing 90 seconds to avoid rate limits 😴"
  sleep 90
end
```

## Put it all together

I threw in some counts and output to track the progress and then started writing this blog post while it ran.

```rb
require 'octokit'

total_count = 0

client = Octokit::Client.new(access_token: 'abc123')

loop do
  puts "\nLooking up PRs..."

  results = client.search_issues('org:learn-co-students author:HarlemSquirrel state:open', sort: :created, order: :asc)
  count = 0

  results.items.each do |pr_info|
    org_repo = pr_info.html_url.slice(%r{[^/]+/[^/]+(?=/pull)})
    next if org_repo.nil? # Probably an issue and not a pull request.

    puts "Closing #{pr_info.html_url}"
    client.close_pull_request(org_repo, pr_info.number)
    count += 1
  end

  puts "Closed #{count} PRs. 😸"

  break if count.zero?

  puts "Pausing 90 seconds to avoid rate limits 😴"
  sleep 90
end

puts "\n Done closing #{total_count} PRs. 😎"
```

And now I finally have a clean set of open pull requests. 😌
