---
layout: post
title:  "Rails link_to do and link_to_if Helpers"
date:   2016-07-15 10:01:00 -0500
categories: rails links helpers
---

If you are building web applications with Ruby on Rails then you likely have used the `link_to` helper to build hyperlinks. It's a more developer-friendly way of adding links to erb templates and can be used with other helpers like `new_session_path` provided by devise. So...
{% highlight erb %}
<%= link_to 'Log In', new_session_path %>
<!-- becomes -->
<a href="/log_in">Log In</a>
{% endhighlight %}
<br>

### link_to do
But sometimes we want to make links out of images. Well, `link_to` accepts a block to make this work. We can pass it an image tag via another helper.
{% highlight erb %}
<%= link_to new_session_path do %>
  <%= image_tag 'hollow-log-18923867.jpg' %>
<% end %>
<!-- becomes -->
<a href="/log_in">
  <img alt="hollow-log-18923867" src="https://thumbs.dreamstime.com/m/hollow-log-18923867.jpg">
</a>
{% endhighlight %}
<br>

### link_to_if and link_to_unless
Some links only need to appear under certain conditions. For this, we have `link_to_if` and `link_to_unless` to the rescue. It accepts a condition and is cleaner for single links than creating an entire `if` block in your view.
{% highlight erb %}
<%= link_to_if(user_signed_in?, 'My Profile', user_path(current_user) %>
<!-- is the same as -->
<% if user_signed_in? do %>
  <%= link_to 'My Profile', user_path(current_user) %>
<% end %>

<%= link_to_unless(user_signed_in?, 'Log In', new_session_path %>
<!-- is the same as -->
<% unless user_signed_in? do %>
  <%= link_to 'Log In', new_session_path %>
<% end %>
{% endhighlight %}

These are just some nice ways to clean up your code and show off a few nice tricks that Ruby on Rails provides.
