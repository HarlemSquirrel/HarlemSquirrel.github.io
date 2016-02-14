---
layout: post
title:  "Classroom Library Web App"
date:   2016-02-14 12:33:00 -0500
categories: jekyll update
---

I have built my first original web app! My [Classroom Library Web App][classroom-library] was inspired by my lovely wife who is a high school English teacher. She has quite the large collection of books in her classroom thanks to a few very generous donors and DonorsChoose. I decided to work on a web app that could help her organize this library and lend out books to students.

This web app is basic but I tried to make it user-friendly and somewhat visually appealing. I chose a purple theme because this is my wife's favorite color. I happen to like the way black translucent divs looks on top of this as well. I wanted to reserve any other color for elements that deserve attention such as green for available books and yellow for books on loan. I had a lot of fun playing with the CSS I have learned including adding a font using Google Fonts.

I did run into some trouble along the way. I noticed that my application controller was quickly getting quite large. I looked back into previous Learn lessons to find out how to separate that. I decided to put user actions into `users_controller.rb` and books actions into `books_controller.rb`. This initially threw many errors and then I realized I had to edit my `config.ru` to include...
{% highlight ruby %}
  use Rack::MethodOverride
  use BooksController
  use UsersController
  run ApplicationController
{% endhighlight %}

This still didn't work and I seemed to have issues related to sessions. I tried adding the following to each controller and...voila! It worked!
{% highlight ruby %}
  configure do
    set :public_folder, 'public'
    set :views, 'app/views'
    enable :sessions
    register Sinatra::ActiveRecordExtension
    register Sinatra::Flash
    set :session_secret, "secret"
  end
{% endhighlight %}

Now, the next issue was that I initially had to include the `Helpers` class in each controller. Well, I went back to a previous Learn lab and saw that this was simply moved to a `helpers.rb` file inside a `helpers` directory inside my `app` directory. All I had to do was to move this and...voila! I no longer had to include that class in each controller file.

Another thing I wanted to do was to customize the layout for users logged in versus not logged in. However, this threw errors when trying to find a user by `session[:id]` when `session[:id]` was nil. Yikes. I addressed this in two ways. First, I built a check into one of my helper methods...

{% highlight ruby %}
  def self.is_logged_in?(session)
    session[:id] != nil && !!self.current_user(session)
  end
{% endhighlight %}

Next, I found that in certain conditions that my homepage would crash if it couldn't find a user, so I added a rescue that would clear the session if there were any funky errors when running the `is_logged_in?`...

{% highlight ruby %}
  get '/' do
    begin
      Helpers.is_logged_in?(session)
    rescue
      session.clear
    end
    @session = session
    @user = Helpers.current_user(session)
    erb :index
  end
{% endhighlight %}

One of the requirements of this project was handling some errors by delivering messages to the user. After a bit of internet searching I came across the [Sinatra Flash][sinatra-flash] gem. Bingo! It is a light gem that does exactly what I needed it to do! Sending a clean but clear message without javascript popups became really easy.

{% highlight ruby %}
  if params[:title] == ""
      flash[:error] = "You must enter a title"
      redirect to '/books/new'
    end
{% endhighlight %}

I really have learned a lot here and this was quite fun! I posted a [walkthrough video][walkthrough] where you can see the user interface. I cannot wait to move forward and continue my adventure with [Learn Verified][learn-verified].


[classroom-library]: https://github.com/HarlemSquirrel/classroom-library
[sinatra-flash]: https://github.com/SFEley/sinatra-flash
[learn-verified]: https://learn.co/verified
[walkthrough]: https://www.youtube.com/watch?v=RnCwkE9IVN4
