---
layout: post
title:  "Dark-Light Mode Switcher"
date:   2017-01-31 09:01:00 -0500
categories: css javascript
---

There are two sides to every story, opposites attract, the yin and the yang, etc. Long is the struggle of good against evil: the light versus the dark. If there's one thing most people will likely agree on is that there is no consensus on visual preference when it comes to dark web pages verses light ones. I won't give away my preference but maybe you'll get some ideas based on this site.

When developing public websites it is helpful to appeal to as many people as you can. One way to address the eternal day v. night debate is to provide a way for users to choose: have it their way.

CSS, HTML, and JavaScript are all we need to make a little magic happen. First, we want two sets of styles for dark and light. Here's a simple example.

```css
body.dark-mode {
  background-color: #111;
  color: #eee;
}
body.dark-mode a {
  color: #111;
}
body.dark-mode button {
  background-color: #eee;
  color: #111;
}

body.light-mode {
  background-color: #eee;
  color: #111;
}
body.light-mode a {
  color: #111;
}
body.light-mode button {
  background-color: #111;
  color: #eee;
}
```

Using SCSS as I prefer can help us clean this up a bit with nesting and variables.

```scss
$dark-color: #111;
$light-color: #eee;

body.dark-mode {
  background-color: $dark-color;
  color: $light-color;
  a {
    color: $dark-color;
  }
  button {
    background-color: $light-color;
    color: $dark-color;
  }
}

body.light-mode {
  background-color: $light-color;
  color: $dark-color;
  a {
    color: $dark-color;
  }
  button {
    background-color: $dark-color;
    color: $light-color;
  }
}
```

Now we need something for our user to click on to toggle this for us. Let's make a JavaScript function. We will need to add an id to the main element, `body#body` in this case, then check its current class. Based on the current class we can apply the new class.

```js
function toggleDarkLight() {
  var body = document.getElementById("body");
  var currentClass = body.className;
  body.className = currentClass == "dark-mode" ? "light-mode" : "dark-mode";
}
```

Or if you'd like to use jQuery we can use `toggleClass()`.

```js
function toggleDarkLight() {
  var $body = $("body");
  $body.toggleClass("dark-mode light-mode")
}
```

Finally, we need something on our document to trigger the toggle. Let's add a button with a moon emoji! When the user clicks this, it will run our function.

```html
<button type="button" name="dark_light" onclick="toggleDarkLight()" title="Toggle dark/light mode">🌛</button>
```

You can of course add more style to either side. It's important to keep things balanced or switching back and forth could be an unpleasant experience. Place anything in these classes dealing with color, while position, size, and other style should go where it will be applied in either dark or light mode. Try out the complete example in the CodePen below.

<p data-height="265" data-theme-id="dark" data-slug-hash="NdMebZ" data-default-tab="css,result" data-user="HarlemSquirrel" data-embed-version="2" data-pen-title="Dark -Light Mode Switcher" class="codepen">See the Pen <a href="http://codepen.io/HarlemSquirrel/pen/NdMebZ/">Dark -Light Mode Switcher</a> by Kevin McCormack (<a href="http://codepen.io/HarlemSquirrel">@HarlemSquirrel</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
