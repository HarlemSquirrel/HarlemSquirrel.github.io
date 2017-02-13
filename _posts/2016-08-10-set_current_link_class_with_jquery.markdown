---
layout: post
title:  "Set Current Link Class with jQuery"
date:   2016-08-10 13:01:00 -0500
categories: js jquery
---

The other day I was was trying to DRY up the code in a rails application I was working on by reusing a view that's not a partial. I took care of the models to display in the controller but needed to show which link was active by adding the CSS class `current`.

My first thought was to pass something, say a hash called `@link_class` with possible links, through the controller.

{% highlight ruby %}
def show
  @user = User.find(params[:id])
  @stuff = @user.stuff
  @link_class = {}
  @link_class[:my_stuff] = 'current'
end

def show_liked_stuff
  @user = User.find(params[:id])
  @stuff = @user.liked_stuff
  @link_class = {}
  @link_class[:likes] = 'current'
  render :show
end
{% endhighlight %}

And in my view...

{% highlight erb %}
<li><%= link_to 'Likes', user_liked_stuff_path(@user), class: @link_class[:likes] %></li>
<li><%= link_to 'My Stuff', user_path(@user), class: @link_class[:my_stuff] %></li>
{% endhighlight %}

But that left a terrible taste in my mouth. I knew it wasn't the beer I was drinking, so I set out to craft a more elegant solution. &#x1f37a;

JavaScript has some nifty ways to grab the current URL such as `window.location.href` and `window.location.pathname`. The former will grab the entire URL while the latter will just grab the path after the protocol and domain. Pathname is what I was looking for since in my rails app I have mostly relative links to navigate around. So now I was thinking that I could somehow match the current pathname with the link and add the class I needed.

Good thing for me, jQuery can [select elements by attribute and value][jquery-select-element-by-attribute-and-value]. I can add the class for the parent element `user-nav` to my selector to make sure I don't grab a link from my header or elsewhere.

{% highlight js %}
$('.user-nav [href="' + window.location.pathname + '"]')
{% endhighlight %}

I slapped that into the console in Firefox dev tools...it works! Now I just have to add the class I need. I can use [className from plain old JavaScript][js-classname] to do that!

{% highlight js %}
$('.user-nav [href="' + window.location.pathname + '"]').className = "current";
{% endhighlight %}

Eureka! But what if I want to reuse this with a different nav? How about a function?

{% highlight js %}
function setNavLinkClassToCurrent(navClass) {
  $(navClass + ' [href="' + window.location.pathname + '"]').className = "current";
}
{% endhighlight %}

Now we're talking! I can reuse this puppy by just calling `setNavLinkClassToCurrent('.user-nav')`, `setNavLinkClassToCurrent('.main-nav')`, or `setNavLinkClassToCurrent('.beer-nav')`. I could even go a step further if we wanted to have our pick of CSS classes to apply.

{% highlight js %}
function setCurrentNavLinkClass(navClass, linkClass) {
  $(navClass + ' [href="' + window.location.pathname + '"]').className = linkClass;
}
{% endhighlight %}

Cool! I can do `setCurrentNavLinkClass('.user-nav', 'current')` or `setCurrentNavLinkClass('.main-nav', 'bananas')` or whatever else floats my boat.

[jquery-select-element-by-attribute-and-value]: http://api.jquery.com/attribute-equals-selector/
[js-classname]: https://developer.mozilla.org/en-US/docs/Web/API/Element/className
