---
layout: post
title:  Check SSL Certificate and Key pairs with Ruby
date:   2020-06-20 08:00:00 -0500
categories: ruby
---

I recently requested signed SSL certificates at work for a project I was working on. I first
generated keys and certificate signing requests. When I got the certificates back, I wanted to
ensure I correctly matched up the new certificates with the keys since mixing those up would break
SSL/TLS negotiation.

Initially I found some blog posts about checking if a certificate belongs to a key using the
`openssl` command-line tool but it was not straight forward. I knew there must be a better way and
so I delved into the Ruby OpenSSL documentation. I finally found
[OpenSSL::X509::Certificate#check_private_key](https://ruby-doc.org/stdlib-2.7.1/libdoc/openssl/rdoc/OpenSSL/X509/Certificate.html#method-i-check_private_key).

We can read the key and certificate from files.

```rb
key = OpenSSL::PKey::RSA.new File.read('/path/to/key_file.key')
cert = OpenSSL::X509::Certificate.new File.read('/path/to/certificate_file.cer')
```

Then we call `#check_private_key` on the certificate while providing the key. If the certificate
belongs to the key, we should get `true` back.

```rb
cert.check_private_key key
# => true
```

To make this a bit easier to reuse later, I wrote a tiny i
[Ruby script](https://github.com/HarlemSquirrel/scripts/blob/master/check_ssl_cert_and_key.rb)
that takes two runtime arguments for the certificate and key and returns a human-friendly response
in green for a match or red for a mismatch.
