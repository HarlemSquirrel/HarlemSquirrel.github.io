---
layout: post
title:  "Stand Up a Rails App with SSL, Sidekiq, and PostgreSQL using Capistrano on a DigitalOcean Ubuntu 16.04 Droplet"
date:   2018-06-1 05:00:00 -0500
categories: rails digitalocean
---

After hosting a Rails app on Heroku for quite some time I was looking for a way to have some more control and get more familiar with [DigitalOcean]. Their $5 droplet is quite nice for getting started with 1 GB of RAM, 25 GB of storage, and 1 TB of transfer right now.

I could not find a single guide on setting things up the way I needed so I thought this might help others who are looking into a similar stack.

This is how I got it done.

## Set up a new droplet

Let's create a new droplet for our application. We create an account and/or log in and navigate to our [DigitalOcean dashboard].

### Create a new Ubuntu 16.04 droplet with attached block storage and SSH ability

This is done on DigitalOcean through the web interface. Make sure we either select an existing SSH key or upload a new one so you can SSH into the new droplet. I chose the $5 droplet but we can of course choose something more powerful if needed. Also make sure to create a volume that we'll use later to store our database store. A 1GB volume should be good to start. This will allow us to separate our server from our data in case we need to rebuild our server.

We'll also need to configure DigitalOcean to manage our custom domain and point to the new droplet. More information on that can be found by reading [An Introduction To DigitalOcean DNS]

### Set up SSH config

Now we can set up our SSH config to allow us to SSH into our droplet without needing to remember the IP address.

```sh
# ~/.ssh/config
Host do-app-name-root
  Hostname 0.0.0.0 # IP address of the DigitalOcean droplet
  IdentitiesOnly yes
  IdentityFile ~/.ssh/digitalocean_rsa # change this if you're using a different key
  User root

Host do-app-name
  Hostname 206.81.1.86 # IP address of the DigitalOcean droplet
  IdentitiesOnly yes
  IdentityFile ~/.ssh/digitalocean_rsa # change this if you're using a different key
  PasswordAuthentication yes
  User rails # We will create this user later
```

### SSH in as root

Time to connect to the droplet! Let's set up a `rails` user to run our application.

```sh
ssh do-app-name-root

# Add the rails user with super cow powers
adduser rails
gpasswd -a rails sudo

# Temporarily enable password SSH
vim /etc/ssh/sshd_config
# PasswordAuthentication yes
```

### Copy the SSH key to the server as the rails user

Our SSH key is alread on the server for the `root` user, but not for `rails`. Let's fix that.

```sh
# Run this from your local machine
ssh-copy-id -i /path/to/id_rsa_file.pub do-app-name
```

### Disable SSH password auth

Now we no longer need password auth so let's disable that for better security. Back on the server as root, edit the `sshd_config` file one last time.

```sh
vim /etc/ssh/sshd_config
# PasswordAuthentication no
```

### Install the required packages

It's time to install the packages we'll need. Connect to the server as the `rails` user.

```sh
ssh do-app-name
sudo apt install curl git-core nginx postgresql postgresql-contrib libpq-dev nodejs redis-server
```

### Set up the volume

Let's set up the volume.

```sh
# Create a mount point for your volume:
mkdir -p /mnt/vol-name

# Mount your volume at the newly-created mount point:
mount -o discard,defaults,noatime /dev/disk/by-id/scsi-0DO_Volume_vol-name /mnt/vol-name

# Change fstab so the volume will be mounted after a reboot
echo '/dev/disk/by-id/scsi-0DO_Volume_vol-name /mnt/vol-name ext4 defaults,nofail,discard 0 0' | sudo tee -a /etc/fstab

```

### Set up PostgreSQL

We can get PostgreSQL up and running on our volume with just a few commands.

```sh
# Create the user
sudo -u postgres createuser --superuser rails

# Point to the volume
sudo nano /etc/postgresql/9.5/main/postgresql.conf
data_directory = '/mnt/vol-name/postgresql/9.5/main'
sudo service postgresql restart
```

### Install RVM, Ruby, and Bundler

To manage Ruby versions, I like to use RVM. So let's install that! We also need `Bundler` installed so that Capistrano can install our app's gems.

```sh
gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
curl -sSL https://get.rvm.io | bash -s stable
rvm install 2.4.2
gem install bundler
```

### Setup Redis

There should not be much to do here. Redis should be running and set to run at boot. We can confirm this.

```sh
$ systemctl status redis
# ● redis-server.service - Advanced key-value store
#    Loaded: loaded (/lib/systemd/system/redis-server.service; enabled; vendor preset: enabled)
#    Active: active (running) since Fri 2018-06-01 12:34:34 UTC; 3min 32s ago
#      Docs: http://redis.io/documentation,
#            man:redis-server(1)
#  Main PID: 24674 (redis-server)
#    CGroup: /system.slice/redis-server.service
#            └─24674 /usr/bin/redis-server 127.0.0.1:6379

# If further configuration is needed.
sudo nano /etc/redis/redis.conf
```

### Create the code folder

We need a place to store our application code on the server. So let's create that.

```sh
sudo mkdir /var/www/app-name
sudo chown rails /var/www/app-name
```

## Prepare the app

Let's set up [Capistrano] for deploying our app. We need to add some gems.

```ruby
# Gemfile

#...

group :development do
  gem 'capistrano',         require: false
  gem 'capistrano-rvm',     require: false
  gem 'capistrano-rails',   require: false
  gem 'capistrano-bundler', require: false
  gem 'capistrano3-puma',   require: false
  gem 'capistrano-sidekiq', require: false
end
```

Now we install these gems with `bundle update` and create a `Capfile` in our project root directory.

```ruby
# Capfile

# Load DSL and set up stages
require 'capistrano/setup'

# Include default deployment tasks
require 'capistrano/deploy'

# Load the SCM plugin appropriate to your project:
require 'capistrano/scm/git'
install_plugin Capistrano::SCM::Git

# Include tasks from other gems included in your Gemfile
require 'capistrano/bundler'
require 'capistrano/scm/git'
require 'capistrano/puma'
require 'capistrano/rails'
require 'capistrano/rvm'
require 'capistrano/sidekiq'

install_plugin Capistrano::Puma  # Default puma tasks
install_plugin Capistrano::Puma::Workers  # if you want to control the workers (in cluster mode)
install_plugin Capistrano::Puma::Nginx  # if you want to upload a nginx site template

# Load custom tasks from `lib/capistrano/tasks` if you have any defined
Dir.glob('lib/capistrano/tasks/*.rake').each { |r| import r }
```

Add an NGINX config

```nginx
# config/nginx.conf

upstream puma {
  server unix:///var/www/app-name/shared/tmp/sockets/app-name-puma.sock;
}

server {
  listen 80 ;
  listen [::]:80 ;

  root /var/www/app-name/current/public;
  access_log /var/www/app-name/current/log/nginx.access.log;
  error_log /var/www/app-name/current/log/nginx.error.log info;
    server_name www.app-name.com; # managed by Certbot


  location ^~ /assets/ {
    gzip_static on;
    expires max;
    add_header Cache-Control public;
  }

  try_files $uri/index.html $uri @puma;
  location @puma {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_redirect off;

    proxy_pass http://puma;
  }

  error_page 500 502 503 504 /500.html;
  client_max_body_size 10M;
  keepalive_timeout 10;

  listen [::]:443 ssl; # managed by Certbot
  listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/app-name.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/app-name.com/privkey.pem; # managed by Certbot
  include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot



}
```

Then, we set up our deploy script.

```ruby
# frozen_string_literal: true
# config/deploy.rb

require "capistrano/deploy"

# config valid for current version and patch releases of Capistrano
lock "~> 3.10.1"

set :application,   'app-name'
set :repo_url,      'git@bitbucket.org:app-name/app-name.git' # set this to your remote git URL
set :user,          'rails'
set :stage,         :production

append :linked_files, '.env.production'

append :linked_dirs,  'bin', 'log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system'

# do-app-name should resolve to the IP address for the newly created DigitalOcean droplet
server 'do-app-name', port: 22, roles: [:web, :app, :db], primary: true

set :user,            'rails'
set :puma_bind,       "unix://#{shared_path}/tmp/sockets/#{fetch(:application)}-puma.sock"

set :ssh_options,     { forward_agent: true, user: fetch(:user), keys: %w(~/.ssh/digitalocean_rsa) }
set :puma_preload_app, true
set :puma_init_active_record, true  # Change to false when not using ActiveRecord

namespace :deploy do
  task :copy_config do
    on release_roles :app do |role|
      fetch(:linked_files).each do |_linked_file|
        user = role.user + "@" if role.user
        hostname = role.hostname
        linked_files(shared_path).each do |file|
          run_locally do
            execute :rsync,
                    file.to_s.gsub(%r{.*/(.*)$}, '\1'),
                    "#{user}#{hostname}:#{file.to_s.gsub(%r{(.*)/[^/]*$}, '\1')}/"
          end
        end
      end
    end
  end
end
before "deploy:check:linked_files", "deploy:copy_config"

namespace :deploy do
  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      invoke 'puma:restart'
    end
  end

  after  :finishing,    :cleanup
end
```

## First Deploy

We need to push our code to the server so we have the NGINX config available.

```sh
cap production deploy
```

Our app should be up and running on our custom domain! Give it a whirl!

## Set up SSL and NGINX

Any website worth anything should have HTTPS working. Lucky for us, [Certbot] and [Let's Encrypt] have us covered!

```sh
# On the server as `rails` user
sudo add-apt-repository ppa:certbot/certbot
sudo apt update
sudo apt-get install python-certbot-nginx

sudo certbot --nginx -d app-domain.com -d www.app-domain.com
```

```sh
# Configure NGINX as rails user on server
sudo rm /etc/nginx/sites-enabled/default
sudo ln -nfs "/var/www/app-name/current/config/nginx.conf" "/etc/nginx/sites-enabled/app-name"
```

```sh
# Restart NGINX
sudo service nginx restart
```

Our app should be up and running on our custom domain WITH SSL! Time for a beer. 🍻

[DigitalOcean]: https://www.digitalocean.com
[DigitalOcean dashboard]: https://cloud.digitalocean.com/dashboard
[Capistrano]: http://capistranorb.com/
[An Introduction To DigitalOcean DNS]:https://www.digitalocean.com/community/tutorials/an-introduction-to-digitalocean-dns
[Certbot]: https://certbot.eff.org
[Let's Encrypt]: https://letsencrypt.org/
