---
layout: post
title:  Build a Ruby gem with Rust extensions
date:   2023-03-08 08:00:00 -0500
categories: ruby
---

> Programmers who need to “dip down” into lower-level control can do so with Rust, without taking on the customary risk of crashes or security holes, and without having to learn the fine points of a fickle toolchain. Better yet, the language is designed to guide you naturally towards reliable code that is efficient in terms of speed and memory usage.

_— Nicholas Matsakis and Aaron Turon ([The Rust Programming Language](https://doc.rust-lang.org/book/foreword.html))_

Rust is a powerful, relatively-young programming language currently used in [YJIT](https://github.com/ruby/ruby/blob/master/doc/yjit/yjit.md) and [Linux](https://rust-for-linux.com/).

Ruby has long supported [building gems with extensions](https://guides.rubygems.org/gems-with-extensions/) in C and Java. As of RubyGems 3.3.11 we can quickly create a new gem with Rust extensions.

![RubyGems 3.3.11](/assets/images/ruby-gems-3.3.11-rust.png)

## Generate the scaffolding

Let's give it a try! We can call the new gem `myrustygem`

```sh
bundle gem --ext=rust myrustygem
```

![Ruby gem init with Rust](/assets/images/ruby-gem-init-with-rust.png)

## Take a look at some of the generated files

Note these configurations in the gem specification file.

```rb
# myrustygem.gemspec

Gem::Specification.new do |spec|
  # ...

  # The paths to require in Ruby
  spec.require_paths = ["lib"]

  # Path to our Rust manifest file
  spec.extensions = ["ext/myrustygem/Cargo.toml"]

  # Helper for Rust extensions
  spec.add_dependency "rb_sys", "~> 0.9.39"

  # Helper for simplifying the build and package process
  spec.add_development_dependency "rake-compiler", "~> 1.2.0"
end
```

Next, we have our `extconf.rb` file which configures a Makefile that will build our extension. We don't need much here thanks to `rb_sys`.

```rb
# ext/myrustgem/extconf.rb

require "mkmf"
require "rb_sys/mkmf"

create_rust_makefile("myrustygem/myrustygem")
```

The `Rakefile` loads in the tasks we will use to build, test, and lint the code.

```rb
# Rakefile

require "bundler/gem_tasks"
require "rspec/core/rake_task"

RSpec::Core::RakeTask.new(:spec)

require "rubocop/rake_task"

RuboCop::RakeTask.new

# This is from the rake-compile gem
require "rake/extensiontask"

task build: :compile

Rake::ExtensionTask.new("myrustygem") do |ext|
  ext.lib_dir = "lib/myrustygem"
end

# Run the compile, spec, and rubocop tasks by default
task default: %i[compile spec rubocop]
```

The default at the bottom allows us to simple run `rake` to compile, then test, then lint the code.

The metadata needed to compile the Rust portion of the gem is contained in a `Cargo.toml` file.

```toml
# ext/myrustgem/Cargo.toml
[package]
name = "myrustygem"
version = "0.1.0"
edition = "2021"
authors = ["Kevin McCormack <kevin@mccormack.tech>"]
license = "MIT"
publish = false

[lib]
crate-type = ["cdylib"]

[dependencies]
magnus = { version = "0.5" }
```

Notice we have a single dependency here: `magnus`. [Magnus](https://github.com/matsadler/magnus) provides Ruby bindings for Rust. It allows calling Ruby methods from Rust or calling Rust functions from Ruby. We are doing the later since we are making a Ruby gem that will call a Rust function.

The Rust code generated here for us is a very simple example that
- Imports from magnus
- Defines a Rust function
- Defines a Ruby module
- Defines a Ruby singleton method on the Ruby module

```rs
use magnus::{define_module, function, prelude::*, Error};

fn hello(subject: String) -> String {
    format!("Hello from Rust, {}!", subject)
}

#[magnus::init]
fn init() -> Result<(), Error> {
    let module = define_module("Myrustygem")?;
    module.define_singleton_method("hello", function!(hello, 1))?;
    Ok(())
}
```

## Let's compile!

We run `rake compile` to...compile!

![compile](/assets/images/ruby-rust-gem-compile.png)

We have a new shared library file created at `lib/myrustygem/myrustygem.so` which our gem will load at runtime.

## Let's try it out

The scaffolding includes `bin/console` that loads our gem code and starts an IRB session. Then we can call the new singleton method.

```txt
➤  bin/console
3.2.1 :001 > Myrustygem.hello("Gandalf")
"Hello from Rust, Gandalf!"
```

## Other resources

- [RubyGems Gems with Extensions Guide](https://guides.rubygems.org/gems-with-extensions/)
- [Rust language](https://www.rust-lang.org/)
- [Ruby tzf gem calling the Rust tzf-rs crate](https://github.com/HarlemSquirrel/tzf-rb)
