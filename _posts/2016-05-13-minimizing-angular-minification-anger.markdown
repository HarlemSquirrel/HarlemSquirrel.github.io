---
layout: post
title:  "Minimizing Angular Minification Anger"
date:   2016-05-13 8:49:00 -0500
categories: angular minification
---

As a coder and developer I know that the prospect of unforeseen consequences is always there. It is very difficult to learn and be aware of all the ins and outs of any language. With using Ruby on Rails we have a melting pot of languages from Ruby, HTML, CSS, and JavaScript to preprocessors like SCSS and Coffee. This mix is what makes the Rails framework so powerful. We can even run our entire app in three different modes: test, development, and production.

One feature that aims to improve performance has recently caused me some mental anguish: [minification][minification]. By default Rails includes the [Uglifier][uglifier] gem. The Uglifier gem is a wrapper for [UglifyJS][uglifyjs] which compresses and minifies JavaScript. One of the ways that this happens is that variable names are shortened as much as possible. This is a problem for Angular.

Take a look at my one page app, [eWorm][eworm]. When building with Angular, we sometimes pass around objects like `$scope` or `$stateProvider` and service functions we create like `BooksService` or `AuthorsService`. UglifyJS sees these as variables whose names can be shortened to save a few bytes. However, changing `$stateProvider` to `$s` and `BooksService` to `B` breaks everything and leaves us with errors like the following:

{% highlight block %}
Error: [$injector:modulerr] Failed to instantiate module app due to:
$stateProvider.state is not a function
{% endhighlight %}

Angular needs to have objects like `$stateProvider` stay as is. I discovered this [Stack Overflow post][stack-overflow-post] by googling my error and knew right away that my strange issues in production that were absent in development were directly tied to minification. Of course I didn't want to not minify my JS code and hinder performance of my app in production, so I has some work to do.

The first step was to fix my `.config()` in my `app.js` file. I had to change this:
{% highlight js %}
angular
  .module('app', ['ui.router', 'ngSanitize', 'templates', 'Devise', 'ngMessages'])
  .config(function ($stateProvider, $urlRouterProvider, AuthProvider) {
    $stateProvider
    .state('home', {
      url: '',
      templateUrl: 'app/views/home.html',
      controller: 'WelcomeController as welcome_ctrl'
    })
    // ...
 })
{% endhighlight %}

I used array notation to specify dependencies like so:
{% highlight js %}
angular
  .module('app', ['ui.router', 'ngSanitize', 'templates', 'Devise', 'ngMessages'])
  .config(['$stateProvider', '$urlRouterProvider', 'AuthProvider', function ($stateProvider, $urlRouterProvider, AuthProvider) {
    $stateProvider
    .state('home', {
      url: '',
      templateUrl: 'app/views/home.html',
      controller: 'WelcomeController as welcome_ctrl'
    })
    // ...
 }])
{% endhighlight %}

In my controllers and services, I opted for setting the `$inject` property like so...
{% highlight js %}
function AuthorController(author) {
	var ctrl = this;
	ctrl.data = author.data.author;
}

// mitigate minification issues
AuthorController.$inject = ['author'];

angular
	.module('app')
	.controller('AuthorController', AuthorController);
{% endhighlight %}

We can test how our JS and CSS code holds up to minification in Rails development mode with one line of code. Keep in mind that this will slow down page loads quite a bit due to the minification processing, so you will likely want to turn this off until you need it.
{% highlight ruby %}
# config/environments/development.rb
Rails.application.configure do
  # ...
  # Compress JavaScripts and CSS.
  config.assets.js_compressor = :uglifier
end
{% endhighlight %}

You can read more about `$injector` at this [Angular docs page][angular-docs-$injector].

[minification]: https://en.wikipedia.org/wiki/Minification_%28programming%29
[uglifier]: https://github.com/lautis/uglifier
[uglifyjs]: https://github.com/mishoo/UglifyJS2
[eworm]: https://github.com/HarlemSquirrel/eWorm
[stack-overflow-post]: http://stackoverflow.com/questions/19671962/uncaught-error-injectorunpr-with-angular-after-deployment
[angular-docs-$injector]: https://docs.angularjs.org/api/auto/service/$injector
