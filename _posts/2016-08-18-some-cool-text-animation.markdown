---
layout: post
title:  "Some Cool CSS3 Text Animation"
date:   2016-08-18 13:03:00 -0500
categories: css animation
---

CSS3 offers some cool features. One of them is [animation][animation]. We can make elements wizz around the DOM, change color, change size, and other nifty arcane magic. The idea of animating some heading text came up in one of the projects I'm working on so I set out to see what I could do.

### Getting Started

[W3Schools][w3schools-css3-animation] was a good first stop to see how animations work in general. They have great little sandboxes where you can play with the code and see what happens. But none of these was doing quite what I needed it to do.

I did some searching on the inter-webs and came across [this blog post][mary-lou-rotating-words] by Mary Lou. She has some really nice examples and I was even able to download everything in a friendly zip file! Her [animate down example][animate-down-ex] was very close to what I was trying to do.

The first change I had to make was to reduce the number of words in the animation from five to three. I just had to make sure to adjust the running time of the animation and remove the extra animation delays. Now we're getting somewhere.

### Vendor Prefixes

I then decided that I didn't need vendor prefixes so I removed the webkit and moz bits. However, I did also discover the awesome tool that takes care of this for you, [Autoprefixer][autoprefixer], in case that's something I wanted to support. There's even a handy [Autoprefixer Rails][autoprefixer-rails] gem. Now my code is a bit slimmer, so that is always good.

### Overlapping DIVs

Since my use case will be for a single centered heading, I had to make some more changes. To make the words overlap and start as not visible, I changed the element for each word from `span` to `div` and wrote some style. I am using SASS in this project so I made use of variables here for easy tweaking and changes latter on.

{% highlight scss %}
div{
    // overlap the divs
    $txt-div-height: 5rem;
    height: $txt-div-height;
    margin-bottom: -$txt-div-height;

    opacity: 0;  // start hidden
    text-align: center;
  }
{% endhighlight %}


### Freeze Frame!

Next, I wanted to make the animation happen once instead of repeating, so I changed `infinite` to `1`. Wait...the last word disappears! That's because the full animation makes the word appear and then disappear. Crap. Looks like I need a separate animation for the third word. I'll rename them so it makes more sense for my usage. So now I have `slideDownThough` and `slideDownIn`. To handle the distance traveled on the y-axis, I used the variable `$font-size` which I created to set the size of the font for the animated words.

{% highlight scss %}
@keyframes slideDownThrough {
  // slide text down and appear, then slide down and disappear
  0% { opacity: 0; }
  2% { opacity: 0; transform: translateY(-$font-size); }
  5% { opacity: 1; transform: translateY(0px); }
  17% { opacity: 1; transform: translateY(0px); }
	20% { opacity: 0; transform: translateY($font-size); }
	80% { opacity: 0; }
  100% { opacity: 0; }
}

@keyframes slideDownIn {
  // slide text down and appear, freeze on last frame to keep it visible
  0% { opacity: 0; }
  2% { opacity: 0; transform: translateY(-$font-size); }
  17% { opacity: 1; transform: translateY(0px); }
  100% { opacity: 1; transform: translateY(0px); }
}
{% endhighlight %}

This was almost enough, but after the last animation the last word would disappear again. Ugh. That's because it's set to invisible when the page loads so after the animation, it will go back to that. Enter [animation-fill-mode][animation-fill-mode] property. This little guy can be set to `forward` which stops my animation on the last frame and so in this case my last word will stay visible. Sweet dragons! &#x1f409;

### Flexing

There are two things that I have come to really love about SASS: nesting and variables. I called on my powers of algebraic manipulation to see if I could make my code more flexible. For this, I created `$animation-delay` and `$animation-length`. Since we have three words to animate, we'll make each word animate for a third of the animation length. We'll take into account any delay we want to have after the page loads as well. This way, we can just adjust our variables to tweak the animations. Oh yeah.

{% highlight scss %}
div:nth-child(1), div:nth-child(2) {
  animation: slideDownThrough $animation-length linear $animation-delay 1;
}
div:nth-child(2) { animation-delay: ($animation-delay + ($animation-length / 3)); }
div:nth-child(3) {
	animation:
    slideDownIn
    ($animation-length / 3)                         // animation length is 1/3 of total run time
    linear                                          // constant timing stucture
    ($animation-delay + ($animation-length / 1.5))  // delay by initial delay plus 2/3 of run time
    1                                               // run once
    forwards;                                       // run once and stop on last frame
}
{% endhighlight %}

### What does it look like?

And here is our final product. Refresh the page, take a three-second chug, and behold. Pretty neat, huh?

<p data-height="265" data-theme-id="0" data-slug-hash="XKQmwm" data-default-tab="css,result" data-user="HarlemSquirrel" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/HarlemSquirrel/pen/XKQmwm/">Animate Text Down Once</a> by Kevin McCormack (<a href="http://codepen.io/HarlemSquirrel">@HarlemSquirrel</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

[animation]: https://developer.mozilla.org/en-US/docs/Web/CSS/animation
[w3schools-css3-animation]: http://www.w3schools.com/css/css3_animations.asp
[mary-lou-rotating-words]: http://tympanus.net/codrops/2012/04/17/rotating-words-with-css-animations/
[animate-down-ex]: http://tympanus.net/Tutorials/CSS3RotatingWords/index.html
[autoprefixer]: https://github.com/postcss/autoprefixer
[autoprefixer-rails]: https://github.com/ai/autoprefixer-rails
[animation-fill-mode]: http://www.w3schools.com/cssref/css3_pr_animation-fill-mode.asp
