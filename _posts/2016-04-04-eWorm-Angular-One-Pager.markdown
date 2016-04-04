---
layout: post
title:  "eWorm with Angular"
date:   2016-04-04 12:46:00 -0500
categories: jekyll update
---

I have again added to my [eWorm Rails Web App][eworm-angular-single-page-app] in a few feature branch. This addition focuses on using an Angular front-end and rails JSON back-end to load and update data on the server on a single page.

I first tweaked my JSON back-end routes in `config/routes.rb`.
{% highlight ruby %}
Rails.application.routes.draw do
  root 'application#angular'
  resources :authors, only: [:index, :show], defaults: { format: 'json' }
  resources :books, defaults: { format: 'json' }
  resources :genres, only: [:index, :show], defaults: { format: 'json' }
  resources :reviews, only: [:create, :edit, :update], defaults: { format: 'json' }
  devise_for :users
end
{% endhighlight %}

I found some great gems that made setting up Angular in rails much easier!  [Angular Rails Templates][angular-rails-templates] was my first stop. The README was very helpful in explaining how to setup JavaScript assets to include Angular. After a little more web searching, I found [Bower Rails][bower-rails] which made installing Angular libraries a breeze with a new rails generator! To get Angular to communicate effectively with [Devise][devise] on the back-end, I found and utilized [Angular Devise][angular-devise]. I got some powerful tools like `Auth.isAuthenticated()` to check if a user is logged in and `Auth.currentUser()` to grab the current user. Nice!

When I began building the one-page app, I made some changes to my rails layouts. I got rid of `<% yield %>` and created a new navigation partial that utilizes the Angular UI Router.
{% highlight erb %}
<header>
  <h3><%= link_to 'eWorm', root_url %></h3>
  <%= render 'layouts/angular_nav' %>
</header>

<div id="main" class="main" ui-view>
{% endhighlight %}

{% highlight html %}
<nav>
  <a ui-sref="books" ui-sref-active="active">Books</a> |
  <span ng-if="isLoggedIn() == false">
    <a ui-sref="login" ui-sref-active="active">Log In</a> |
    <a ui-sref="signup" ui-sref-active="active">Sign Up</a>
  </span>


  <a ng-if="isLoggedIn() == true" href="" ng-click="logOut()">Log out, {{currentUser.username}}</a>
</nav>
{% endhighlight %}

I implemented all routing in an organized fashion with Angular UI Router using states like so...
{% highlight javascript %}
$stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'app/views/home.html',
    controller: 'WelcomeController as welcome_ctrl'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'app/views/login.html',
    controller: 'UserController as user_ctrl'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: 'app/views/signup.html',
    controller: 'UserController as user_ctrl'
  })
  .state('logout', {
    url: '/logout',
    templateUrl: '',
    controller: 'UserController as user_ctrl'
  })
  .state('books', {
    url: '/books',
    templateUrl: 'app/views/books.html',
    controller: 'BooksController as books_ctrl',
    resolve: {
      books: function (BooksService) {
        return BooksService.getBooks();
      }
    }
  })
{% endhighlight %}

To handle checking if a user is logged in, I created some `$rootScope` functions in `Angular.run()`.
{% highlight javascript %}
.run(function ($rootScope, Auth, UserService) {
  $rootScope.$on('$stateChangeSuccess', function($state, evt, to, params) {
    $rootScope.isLoggedIn = UserService.isLoggedIn;
    if ($rootScope.isLoggedIn()) {
      Auth.currentUser().then(function(response) {
        $rootScope.currentUser = response.user;
        }, function(error) {
          console.log(error);
        });
      $rootScope.logOut = function () {
        UserService.logout();
      }
    }
  })
{% endhighlight %}

Filters and sorting are really easy and powerful in Angular. In the view we have...
{% highlight html %}
<input ng-model="books_ctrl.search" placeholder="Search" autofocus/>
Sort by:
<a href="" ng-click="sorter='title'">Title</a> |
<a href="" ng-click="sorter='author.name'">Author</a> |
<a href="" ng-click="sorter='genre.name'">Genre</a>

<div class="book" ng-repeat="book in books_ctrl.paginatedBooks | orderBy :sorter ">
	<book-summary id="book"></book>
</div>
{% endhighlight %}

And in the controller we have...
{% highlight javascript %}
$scope.$watch('books_ctrl.search', function (val) {
	ctrl.filteredBooks = $filter('filter')(books.data.books, val);
	ctrl.paginateBooks()
});
{% endhighlight %}

Updating the list of books happens in real time! It's pretty awesome, I tell you.

This project was challenging because Angular is quite powerful but the error messages are not always helpful. Testing my code in the browser often was essential to success. Again, this project was a unique challenge that forced me to use all of my new-found skills and a great learning experience as I move forward in my Learn Verified adventure!


[eworm-angular-single-page-app]: https://github.com/HarlemSquirrel/eWorm/tree/angular-single-page-app
[angular-rails-templates]: https://github.com/pitr/angular-rails-templates
[bower-rails]: https://github.com/rharriso/bower-rails
[angular-devise]: https://github.com/cloudspace/angular_devise
[devise]: https://github.com/plataformatec/devise
