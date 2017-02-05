---
layout: post
title:  "Upgrading a Rails App from 4.2 to 5.0"
date:   2017-02-05 08:01:00 -0500
categories: ruby rails
---

There are a few reasons why you might want to upgrade a rails app from 4.2 to 5.0. There are security and performance improvements, an API only mode, the very cool Action Cable framework, and [much more][rails5_final]. Making the upgrade happen can take a little time but for me it was really quite smooth once 5.0.1 was released and the gems I was using had a chance to update. Without replicating all of the details in the [Rails Guides Upgrading Guide][rails_guides_upgrading], I'll just give you a low-down on what I had to do with one of my applications.

## Test suite and gem updates

Before actually starting the upgrade I went through my app and beefed up the test coverage. I updated RSpec and Capybara while also adding a couple tests for any loose ends. A comprehensive test suite is key to ensuring full functionality once the upgrade is complete. I am a strong believer that any app worth its weight should have full test coverage anyhow. Once I was happy with my test suite I proceeded to upgrade my other gems like devise, kaminari, fiendly_id, and pg. I bumped Ruby to version 2.3.3. Ruby 2.4 and rails do not play nicely just yet due to some issues with the new unified Integer class. I ran my tests again was ready to go!

## ApplicationRecord and ApplicationJob

Next I had to change a few files. ActiveRecord models now inherit from ApplicationRecord by default so I created that and updated my models. Jobs also now work in a similar way. This app does not have any jobs right now so I just created ApplicationJob.

```ruby
# app/models/application_record.rb
class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
end

# app/models/discussion.rb
class Discussion < ApplicationRecord
  # ...
end

# app/models/post.rb
class Post < ApplicationRecord
  # ...
end

# app/models/application_job.rb
class ApplicationJob < ActiveJob::Base
end
```

## Transactional Callbacks

As indicated in the [Rails Guides Rails 5.0 release notes][rails_guides_rail_5_release_notes], transaction callbacks do not gobble up errors anymore and just allow them to bubble up similar to other callbacks. This means that `raise_in_transactional_callbacks` is depricated so I removed `config.active_record.raise_in_transactional_callbacks = true` from `config/application.rb`.

## Caching

Action Mailer views can now support caching! In addition, enabling cache control now looks a little bit different.

```ruby
# config/environments/development.rb
Rails.application.configure do
  # ...
  config.action_mailer.perform_caching = true
end

# config/environments/production.rb
Rails.application.configure do
  # ...
  config.public_file_server.enabled   = true
  config.public_file_server.headers = { 'Cache-Control' => 'public, max-age=3600' }

  config.action_mailer.perform_caching = true
end
```

## Security

Rails 5 now supports per-form CSRF tokens. Forms created with JavaScript can now have protection against code-injection attacks. Each form in the application will each have their own CSRF token that is specified to the action and method for that form. I defintiely wanted to enable little guy.

We can now also configure our application to check if the HTTP Origin header should be checked against the site's origin as an additional defense agains cross-site request forgery. Why would I not do this enabled in a public-facing app?

```ruby
# config/environments/development.rb
Rails.application.configure do
  # ...
  config.action_controller.per_form_csrf_tokens = true
  config.action_controller.forgery_protection_origin_check = true
end

# config/environments/production.rb
Rails.application.configure do
  # ...
  config.action_controller.per_form_csrf_tokens = true
  config.action_controller.forgery_protection_origin_check = true
end
```

## Pull the trigger

After these changes I was able to edit my Gemfile with `gem 'rails', '~> 5.0.1'` and run `bundle update rails`! It didn't take long at all. Next I ran my test suite and grabbed a beer--success! All the tests passed! I fired up a local server and took her for a test drive. Everything felt smooth and responsive. There was a palpable improvment.

A big thanks to all who contributed to this awesome update to this amazing framework. Go open source!!


[rails5_final]: http://weblog.rubyonrails.org/2016/6/30/Rails-5-0-final/
[rails_guides_upgrading]: http://guides.rubyonrails.org/upgrading_ruby_on_rails.html
[edge_guides_rail_5_release_notes]: http://edgeguides.rubyonrails.org/5_0_release_notes.html
