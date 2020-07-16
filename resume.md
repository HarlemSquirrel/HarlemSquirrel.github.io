---
layout: resume
title: Resume
permalink: /resume
---

[917.209.0326](tel:+1-917-209-0326) | [kevin@mccormack.tech](mailto:kevin@mccormack.tech)
{: .contact-table }

### About Me

![Me at Watkins Glen](https://raw.githubusercontent.com/HarlemSquirrel/kevin_mccormack/master/assets/images/me_watkins_glen.jpg){: .resume-pic }
Since 2016 I have built, deployed, and maintained full stack web applications on Heroku, AWS, Digital Ocean, and on-premise servers. I document my work in detail, use Git for version control, and am familiar with GitHub, Bitbucket, and GitLab. I believe that every application should have a comprehensive test suite. Continuous integration with automated testing and deployments are key in maximizing productivity while minimizing downtime.

I am a big fan of open source software. I have a number of my own projects on GitHub and contribute to other projects when I can such as [home-assistant](https://www.home-assistant.io/), [ActiveLdap](https://github.com/activeldap/activeldap/), and [AmazingPrint](https://github.com/amazing-print/amazing_print/releases).

I am proficient in server side tools including Ruby on Rails and shell scripting. On the client side I am proficient in HTML, CSS (including SCSS), and JavaScript (including jQuery). I am always looking to learn new languages and frameworks. I have been working on Python lately.

Since the spring of 2017, I have been a software engineer at [Weill Cornell Medicine](https://weill.cornell.edu) working closely with architects, analysts, the service desk, and non-technical teams to deploy a custom ecosystem of identity management solutions. More recently I have been stepping into the role of solutions architect in building internal and public-facing ecosystems to securely provide the right access and information at the right time to the right eyes.

### Technologies

- Cloud (AWS Elastic Beanstalk, AWS S3, Digital Ocean)
- Code quality (Brakeman, Code Climate, ESLint, Overcommit, RuboCop, ScssLint, YAMLlint)
- Development operations (Ansible, AWS Code Pipeline, Capistrano, CircleCI, Travis CI, Selenium)
- CSS (SCSS)
- Docker (Compose)
- HTML
- JavaScript (Angular v1, Cropper, Electron, Inputmask, JQuery, Quill, typeahead.js, Webpack, Yarn)
- LDAP (ActiveLDAP, OpenDJ, OpenLDAP, PingDirectory)
- Linux (ArchLinux, CentOS, Fedora, RHEL, Ubuntu)
- Load testing (ApacheBench, Siege)
- Monitoring (New Relic, Uptime Robot)
- OmniAuth
- PHP (SimpleSAMLphp)
- Python (Flask, ldap3)
- Ruby (Active Admin, Capybara, Devise, Haml, JRuby, Rails, RSpec, RVM, Selenium, Sinatra, WebMock)
- SAML (omniauth-saml, ruby-saml, SimpleSAMLphp)
- Shell scripting
- Splunk (splunk-sdk-ruby)
- Version control (Bitbucket GitLab, GitHub)
{: .list-plus.print-page-break}

### Work History

#### Weill Cornell Medicine, New York, NY

**Senior Software Engineer, Identity and Access**, Feb 2020 - Present  
**Identity and Access Software Engineer**, May 2017 - Feb 2020

- Work closely with technical and non-technical teams
- Problem solve with operations and department administrators to constantly improve how individuals access a diverse set of systems
- Design and develop new features for a suite of custom identity management applications built with Ruby on Rails, JRuby, and PHP
- Closely manage and mentor a remote team of off-shore developers
- Closely mentor junior developers
- Design and develop complex data synchronization and processing between a wide range of databases, systems and services
- Build comprehensive test suites for existing applications
- Streamline deployments with Ansible and Capistrano
- Maintain our custom SimpleSAMLphp IDP implementation
- Migrated an on-premise Rails app to AWS as first app in our organization to move to the cloud
- Spearheaded my initiative to extract common custom CSS and JavaScript to a separate repository and secure public CDN hosting
- Design and carry out disaster recovery scenarios for mission-critical applications and services.
{: .list-plus}

#### Code Climate, New York, NY

**Software Engineer**, March 2017 - May 2017

- Work closely with the sales and product teams to update marketing pages
- Update [Middleman](https://github.com/middleman/middleman) app with custom modules
- Move app from Rails Asset Pipeline to Webpack
- Build pages based on designs using HTML, SCSS, and JavaScript
{: .list-plus}

#### Constant Contact, New York, NY

**Software Engineer**, October 2016 - March 2017

- Work on a small team of engineers that works closely with the sales and product teams
- Engage in agile development including team feature planning with Jira
- Develop and maintain three Rails apps that advertise on Facebook for small businesses and nonprofits
- Ensure high code quality with Git, CodeClimate, and CircleCI
- Practice test-driven development with RSpec and Capybara in comprehensive test suites
- Deploy, monitor and debug production apps through Heroku, Honeybadger, Jenkins, New Relic, and Splunk
{: .list-plus}

#### Flatiron School, New York, NY

Online Instructor, May 2016 - October 2016

- Assisted students learning full stack web development with Ruby on Rails and JavaScript
- Fielded student coding and development environment questions
- Triaged issues with the Learn integrated development environment
{: .list-plus}

#### East Bronx Academy, Bronx, NY

**Teacher and Solutions Architect**, Aug 2008 - September 2016

- Designed and taught year-long curriculum for computer science and music in grades 6-12
- Administered Google Apps for Education account with over 800 active users
- Wrote shell scripts and custom OS images to automate Linux desktop deployments
- Honored by Academy for Teachers for innovation as a computer science educator
- Commissioned by PERC to create digital resources for the Exploring Computer Science curriculum
- Commissioned by New Visions for Public Schools to create Google Apps for School Operations screen-cast tutorials
{: .list-plus.print-page-break}

### Projects

**[Web Directory](https://directory.weill.cornell.edu)** - Public listing of people, departments, and services

- Upgrade from Rails 4.1 to 5.2
- Add departments and services to original app with only people
- Move application from on-premise servers to AWS
- Improve integration with Java UnboundID LDAP SDK library and JRuby
- Improve page loading through caching and code refactoring
- Update styles from Boostrap v3 to v4
{: .list-plus}

**[WCM Styles](https://github.com/wcmc-its/wcm-styles)** - CDN-delivered shared custom assets

- Lead my initiative to extract shared styles and utilize free CDN hosting from [JSDelivr](https://www.jsdelivr.com)
- Use Webpack to manage external and custom dependencies and package assets
{: .list-plus}

**[Seedlr](https://seedlr.com)** - Share positive thoughts.

- Coordinate with remote team across geographic divide with Trello, WhatsApp, Git, and Bitbucket
- Build out new features including data models and UI from an InVision app
- Integrate with payment system and mail marketing APIs
- Use JQuery and custom JavaScript to enhance front-end with asynchronous AJAX requests
{: .list-plus}

**[AdLauncher](https://adlauncher.io)** - Making Facebook advertising easy

- Coordinate with a diverse team of engineers, product, and sales personnel
- Use Rails 4.2 and gems including activeadmin, devise, ransack, state_machines, and sidekiq
- Use Bootstrap 4 and custom SCSS to style front end
- Process payments using the Stripe API
- Deploy from Github to Heroku with add-ons such as Mailgun and Redis To Go
- Connect to FacebookAdsAdapter and ConstantContact APIs
{: .list-plus}

**[FacebookAdsAdapter](https://adsapi.io)** - An API to simplify advertising on Facebook

- Abstract the Facebook advertising API complexity for use on AdLauncher and Boost
- Develop with popular gems including carrierwave, clockwork, kaminari, papertrail and puma
{: .list-plus}

**[Boost](https://www.constantcontact.com)** - Boost email campaigns on Facebook

- Maintain legacy JRuby Rails 4.1 app with Ruby 1.9.3
- Extends ConstantContact with Facebook advertising
- Deploy remotely with Jenkins and JRuby
{: .list-plus}

### Open Source Contributions

**[3D Printable Designs](http://www.thingiverse.com/HarlemSquirrel/designs)** - Constructed functional and decorative designs with Blender and OpenSCAD

**[EBA Setup Scripts](https://github.com/HarlemSquirrel/eba-setup-scripts)** - Developed a set of scripts to automate and simplify Linux client deployment and maintenance

**[GNOME Shell Extensions](https://extensions.gnome.org/accounts/profile/HarlemSquirrel)** - Crafted using GNOME JavaScript

**[NYC Farmer’s Markets Ruby CLI Gem](https://github.com/HarlemSquirrel/nyc-farmers-markets-cli-gem)** - Pulled data from NYC Open Data API

### Education

**Flatiron School - New York, NY - 2016**

Full Stack Web Development: Ruby on Rails and JavaScript online immersive program

**Wilkes University - Wilkes-Barre, PA - 2011**

MS: Instructional Media

**City College of New York - New York, NY - 2008**

BFA: Jazz Performance and Education

