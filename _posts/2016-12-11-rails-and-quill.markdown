---
layout: post
title:  "Quill with rails"
date:   2016-12-11 10:01:00 -0500
categories: jekyll update
---

At some point every web developer will reach a point where he or she will be looking to create forms that support rich text editing. Allowing the user to format input can provide a great enhancement and in some cases, like a blog or robust forum, text formatting is kind of expected. There are many solutions out there and I've looked through a few them. I love open source projects that allow me to contribute and see what's going on under the hood. The best open source projects show lots of activity and have very supportive communities. [Quill][quill] was just what I was looking for.

I love the modularity of Quill. It can be simple.

<p data-height="265" data-theme-id="0" data-slug-hash="KzZqZx" data-default-tab="js,result" data-user="quill" data-embed-version="2" data-pen-title="Quill Playground" class="codepen">See the Pen <a href="http://codepen.io/quill/pen/KzZqZx/">Quill Playground</a> by Quill (<a href="http://codepen.io/quill">@quill</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Or it can be robust!

<p data-height="265" data-theme-id="0" data-slug-hash="VmGKXw" data-default-tab="js,result" data-user="HarlemSquirrel" data-embed-version="2" data-pen-title="Autosave" class="codepen">See the Pen <a href="http://codepen.io/HarlemSquirrel/pen/VmGKXw/">Autosave</a> by Kevin McCormack (<a href="http://codepen.io/HarlemSquirrel">@HarlemSquirrel</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>


## [Getting started][getting-started]

1. Include the style sheet
2. Create the editor content
3. Include the Quill library
4. Initiate Quill editor

```html
<!-- Include stylesheet -->
<link href="https://cdn.quilljs.com/1.1.6/quill.snow.css" rel="stylesheet">

<!-- Create the editor container -->
<div id="editor">
  <p>Hello World!</p>
  <p>Some initial <strong>bold</strong> text</p>
  <p><br></p>
</div>

<!-- Include the Quill library -->
<script src="https://cdn.quilljs.com/1.1.6/quill.js"></script>

<!-- Initialize Quill editor -->
<script>
  var quill = new Quill('#editor', {
    theme: 'snow'
  });
</script>
```

## Using with rails

To grab the new formatted content you'll need to use a little JavaScript. If you're using a rails form helper, the easiest way to do this is to assign a unique id to a hidden input field in a form. Then, when the form is submitted, we will place the content from the Quill editor into this field and submit our form.

```js
var form = document.querySelector('#some-form');
form.onsubmit = function() {
  var postContentInput = document.querySelector('#post-content');
  postContentInput.value = quill.root.innerHTML;
};
```

Then to display the new formatted content we can use [`sanitize` from rails][rails-sanitize]. We should whitelist the same tags that we have in our editor toolbar.

```ruby
raw sanitize @post.body, tags: %w(strong em a), attributes: %w(href)
```

[quill]: http://quilljs.com/
[getting-started]: http://quilljs.com/docs/quickstart/
[rails-sanitize]: http://apidock.com/rails/ActionView/Helpers/SanitizeHelper/sanitize
