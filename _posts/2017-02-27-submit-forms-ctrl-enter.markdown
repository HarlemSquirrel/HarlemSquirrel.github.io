---
layout: post
title:  "Submit Your Forms with Ctrl + Enter"
date:   2017-02-27 14:14:00 -0500
categories: javascript
---

By default we can submit forms with the enter key. This works great until we introduce a `textarea` tag or use the `contenteditable` attribute. In these situations the enter key adds a new line as it should. If you are like me you want to avoid touching that mouse just to post in a forum or send an email. This is where we use `Ctrl + Enter`. It already works on popular web apps like Gmail and Twitter as well as desktop apps like Thunderbird.

In order for this to work we need some JavaScript. In this example I am using jQuery. We can bind a function to the `keydown` event and then check if the keys pressed are the ones we are looking for and then submit our form.

```js
$('form').keydown(function(event) {
  // if control + enter were pressed
    // submit the form
})
```

We can check if the control key is being held with [`event.ctrlKey`][ctrlKey]. For the enter key we check the value of [`event.keyCode`][keyCode]. For most broswers the key code will be `13`.

```js
$('form').keydown(function(event) {
  if (event.ctrlKey && event.keyCode === 13) {
    // submit the form
  }
})
```

We can submit our form with the handy jQuery [`.trigger()`][jquery-trigger] function.

```js
$('form').keydown(function(event) {
  if (event.ctrlKey && event.keyCode === 13) {
    $(this).trigger('submit');
  }
})
```

That is it! We can use this on all of our forms or change the selector from `'form'` to the ID of your form. I like to make this into a function that I call on the pages where I need it.

```js
function submitFormsWithCtrlEnter() {
  $('form').keydown(function(event) {
    if (event.ctrlKey && event.keyCode === 13) {
      $(this).trigger('submit');
    }
  })
}
```

Happy coding!

[ctrlKey]: https://www.w3schools.com/jsref/event_ctrlkey.asp
[keyCode]: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
[jquery-trigger]: https://api.jquery.com/trigger/
