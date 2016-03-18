---
layout: post
title:  "eWorm with jQuery and JSON"
date:   2016-03-17 19:13:00 -0500
categories: jekyll update
---

I have added to my [eWorm Rails Web App][eworm] in a few feature branch. This addition focuses on using jQuery scripts and a JSON API backend to load and update data on the server without needing to refresh the page.

I created a JSON backend, which is very easy with rails! My books serializer looks like this:
{% highlight ruby %}
class BookSerializer < ActiveModel::Serializer
  attributes :id, :title, :year_published, :rating_avg
  has_one :author
  has_one :genre
  has_many :reviews
end
{% endhighlight %}

And then I just had to create simple serializers for the other models like so:
{% highlight ruby %}
class AuthorSerializer < ActiveModel::Serializer
  attributes :id, :name
end

class GenreSerializer < ActiveModel::Serializer
  attributes :id, :name
end

class ReviewSerializer < ActiveModel::Serializer
  attributes :id, :content, :rating
  has_one :user
end

class UserSerializer < ActiveModel::Serializer
  attributes :id, :username
end
{% endhighlight %}

After this, is it was just a matter of updating a few controller actions to allow access via JSON like so:
{% highlight ruby %}
class BooksController < ApplicationController
  def index
    # ...
    respond_to do |f|
      f.html { render :index }
      f.json { render json: @books }
    end
  end

  def create
    # ...
    if @book.valid?
      @book.save
      flash.notice = "Book addition successful!"
      render json: @book, status: 201
    #...
  end
  # ...
end
{% endhighlight %}

I added an additional feature, a genre filter on the books index page. It's a nice fast, and clean way to filter the books by genre without refreshing the page! Check out this code snippet:
{% highlight js %}
function genreFilter() {
  $('.genre').on('click', function () {
    var genre = $(this).attr('id');
    var books = [];
    $('#books').empty();
    $.get("/books.json", function (data) {
      $.each(data.books, function (index, book) {
        if (book.genre.name === genre || genre === "a") {
          books.push(book);
        }
      });
      updateBooksView(books);
    });
  });
}
{% endhighlight %}

To help keep my code neat, I wrote my functions inside app/assets/javascripts/books.js and just called the necessary functions on the appropriate views:
{% highlight html %}
<!-- views/books/index.html.erb -->
<script type="text/javascript">
  loadBooks();
  newBookForm();
  genreFilter();
</script>
{% endhighlight %}

I on the books index page, I also implemented a form that could be toggled viewable, and when submitted would automagically add the new book to the page! This was fun and I could see this as a practical feature for some websites as it could reduce the time it takes to add content.

This was challenging because Javascript and jQuery have their quirks that I find quite annoying coming from months of ruby. I found it difficult to store the results of ajax requests in a variable, so I just had to avoid it. Overall this project was a unique challenge and a great learning experience as I move forward in my Learn Verified adventure!


[eworm]: https://github.com/HarlemSquirrel/eworm
