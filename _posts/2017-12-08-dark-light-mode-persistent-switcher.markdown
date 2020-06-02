---
layout: post
title:  "Dark-Light Mode Persistent Switcher"
date:   2017-12-08 08:01:00 -0500
categories: css javascript
---

Earlier this year I posted [Dark-Light Mode Switcher][dark-light-mode-switcher] where I explained how to create a simple theme toggle between light and dark. Per a request from a reader this follow up explains how to make the user's choice persistent.

First, here's a quick overview of our stylesheet and markup.

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

```html
<button type="button" name="dark_light" onclick="toggleDarkLight()" title="Toggle dark/light mode">🌛</button>
```

Now we need to update our `toggleDarkLight()` function to set a cookie. We can use [`document.cookie`][document-cookie] to do this. Let's log our new cookies for now to see the change in the browser console.

```js
function togglePageContentLightDark() {
  var body = document.getElementById('body')
  var currentClass = body.className
  var newClass = body.className == 'dark-mode' ? 'light-mode' : 'dark-mode'
  body.className = newClass

  document.cookie = 'theme=' + (newClass == 'light-mode' ? 'light' : 'dark')
  console.log('Cookies are now: ' + document.cookie)
}
```

Next we add a function to determine if dark mode is currently selected. For now let's default to light mode if a preference has not been saved. This can be easily swapped latter.

```js
function isDarkThemeSelected() {
  return document.cookie.match(/theme=dark/i) != null
}
```

We also need a way to act on this setting so let's create another function.

```js
function setThemeFromCookie() {
  var body = document.getElementById('body')
  body.className = isDarkThemeSelected() ? 'dark-mode' : 'light-mode'
}
```

Finally, we set this function to run when the page loads. There is [a nice pure JavaScript way to run something when the page loads][js-run-when-page-loads].

```js
(function() {
  setThemeFromCookie()
})();
```

And there we have it! Select your preferred theme and reload the page to see it persist! You can see this in action on my [resume page][resume].


[dark-light-mode-switcher]: /css/javascript/2017/01/31/dark-light-mode-switcher.html
[document-cookie]: https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
[js-run-when-page-loads]: https://stackoverflow.com/questions/9899372/pure-javascript-equivalent-of-jquerys-ready-how-to-call-a-function-when-t/9899701#9899701
[resume]: /resume
