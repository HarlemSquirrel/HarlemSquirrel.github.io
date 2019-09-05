---
layout: post
title:  Determining Active Directory Account Status with Ruby
date:   2019-09-03 08:00:00 -0500
categories: ruby
---

In Active Directory, the status on accounts is controlled by the `userAccountControl` attribute. This attribute has [hexidecimal](https://stackoverflow.com/questions/8186965/what-do-numbers-using-0x-notation-mean) values, allowing it to be in many states and offer many different control options with very little storage impact.

Looking at [this Microsoft doc on User-Account-Control attribute](https://docs.microsoft.com/en-us/windows/win32/adschema/a-useraccountcontrol), we should be generally concerned with the last (right-most) digit. When it is `2`, the account is disabled.

Hexadecimal value|Identifier (defined in iads.h)|Description
-|-|-
0x00000002|ADS_UF_ACCOUNTDISABLE|The user account is disabled.
0x00000200|ADS_UF_NORMAL_ACCOUNT|This is a default account type that represents a typical user.

Accounts in a "normal" state have a value of `0x00000200`

Normal accounts typically have `0x00000200` while disabled accounts have `0x00000202`

Let's convert these to integers using Ruby:

```ruby
'0x00000200'.to_i(16)
# => 512

> '0x00000202'.to_i(16)
514
```

Most of the time we see either 512 or 514 as the integer value for this attribute. We can conver the other way as well from integer (base 10) back to hexidecimal (base 16).

```ruby
512.to_s(16)
# => "200"

514.to_s(16)
# => "202"
```

As you can see, the last digit is `2` when `userAccountControl: 514` indicating this account is disabled.

So, how can we build a method to abstract this out for us and return true for active accounts and false inactive accounts?

We could compare strings.

```ruby
def enabled?(user)
  user['userAccountControl'].to_s(16)[-1] != '2'
end

active_user = { 'userAccountControl' => 512 }
inactive_user = { 'userAccountControl' => 514 }

enabled? active_user
# => true

enabled? inactive_user
# => false
```

Or we could make use of a [bitwise operation](https://en.m.wikipedia.org/wiki/Bitwise_operation). These typically much faster than comparing strings and will use less memory. Ruby provides a nice (bitwise AND)[https://ruby-doc.org/core-2.6.4/Integer.html#method-i-26] for integers.

```ruby
512 & 0x002
# => 0

514 & 0x00000002
# => 2

# Active, but locked out account
528.to_i & 0x002
# => 0
```


Now, we can just check that the return value of this operation is zero.

```ruby
def enabled?(user)
  (user['userAccountControl'] & 0x002).zero?
end
```

```ruby
active_user = { 'userAccountControl' => 512 }
inactive_user = { 'userAccountControl' => 514 }

enabled? active_user
# => true

enabled? inactive_user
# => false
```

This also works with other combinations such as when no password is required.

Hexadecimal value|Identifier (defined in iads.h)|Description
-|-|-
0x00000020|ADS_UF_PASSWD_NOTREQD|No password is required.

```ruby
active_nopwd_user = { 'userAccountControl' => 544 }
inactive_nopwd_user = { 'userAccountControl' => 546 }

enabled? active_nopwd_user
# => true

enabled? inactive_nopwd_user
# => false
```
