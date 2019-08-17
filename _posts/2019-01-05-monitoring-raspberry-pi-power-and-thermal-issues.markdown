---
layout: post
title:  Monitoring Raspberry Pi Power and Thermal Issues
date:   2019-01-05 05:00:00 -0500
categories: shell
---

The Raspberry Pi is an awesome, fun, and (mostly) open source mini-computer for tinkerers. It runs [Linux], [FreeBSD], and recently even [Windows 10 IoT].

This byte-sized guy runs on just a few volts typically delivered through micro USB. The [current (mA) requirements] depend on what is connected but it can be tempting to grab an old smart phone power brick and cable or order a cheap one online. However, if our Pi does not get the juice it needs we can run into all sorts of problems.

A Raspberry Pi can be overclocked and is generally passively cooled which can result in high temperatures under load. When temperatures get too high the firmware should throttle back to prevent damage.

Luckily we have some tools built into [Raspbian], the de facto Linux distribution for Raspberry Pi, to monitor for issues related to power and temperature. Enter [`vcgencmd`]. With this command, we can get information on clock frequency, voltage, temperature, and more.

```
$ vcgencmd measure_clock core
frequency(1)=250000000
$ vcgencmd measure_volts core
volt=1.2000V
$ vcgencmd measure_temp
temp=42.2'C
```

We also have a sub-command which reports throttling.

```
$ vcgencmd get_throttled
throttled=0x50000
```

But what in the world does `0x50000` mean? After a bit of Internet scouring I came across a helpful [Raspberry Pi forum post] with "the bits in this number represent:"

```
0: under-voltage
1: arm frequency capped
2: currently throttled
16: under-voltage has occurred
17: arm frequency capped has occurred
18: throttling has occurred
```

I was still a bit cloudy as to what was going on here so I searched some more and found this [Raspberry Pi firmware commit comment] on GitHub:

```
1110000000000000010
|||             |||_ under-voltage
|||             ||_ currently throttled
|||             |_ arm frequency capped
|||_ under-voltage has occurred since last reboot
||_ throttling has occurred since last reboot
|_ arm frequency capped has occurred since last reboot
```

I see now that the previous post was referencing the digit starting with 0 from the right. In order to make sense of the value we got above we need to convert `0x50000` from hexadecimal to binary. [Python] can do this for us.

We can convert the string to an integer.

```python
int('0x50000', 16) # Set the base to 16 for hexadecimal
# 327680

# or

int('0x50000', 0) # Set the base to 0 to let Python figure it out based on the 0x
# 327680
```

Now we can convert this integer to a binary number.

```python
bin(327680)
'0b1010000000000000000'
```

Or all at once...

```python
throttled = 0x50000
throttled_binary = bin(throttled)
print(throttled_binary)
# 0b1010000000000000000
```

Now let's line this with up with our chart.

```
0b1010000000000000000
  1110000000000000010
  |||             |||_ under-voltage
  |||             ||_ currently throttled
  |||             |_ arm frequency capped
  |||_ under-voltage has occurred since last reboot!!
  ||_ throttling has occurred since last reboot
  |_ arm frequency capped has occurred since last reboot!!
```

The double bang indicates which flags we've found. It looks like our Pi was at some point getting less voltage than it should and the ARM frequency was throttled since the last reboot. This means we likely need a better power supply.

I've crafted a crude Python 2 script which checks all of this for us.

```python
#!/usr/bin/env python2

import subprocess

GET_THROTTLED_CMD = 'vcgencmd get_throttled'
MESSAGES = {
    0: 'Under-voltage!',
    1: 'ARM frequency capped!',
    2: 'Currently throttled!',
    16: 'Under-voltage has occurred since last reboot.',
    17: 'Throttling has occurred since last reboot.',
    18: 'ARM frequency capped has occurred since last reboot.'
}

print("Checking for throttling issues since last reboot...")

throttled_output = subprocess.check_output(GET_THROTTLED_CMD, shell=True)
throttled_binary = bin(int(throttled_output.split('=')[1], 0))

warnings = 0
for position, message in MESSAGES.iteritems():
    # Check for the binary digits to be "on" for each warning message
    if len(throttled_binary) > position and throttled_binary[0 - position - 1] == '1':
        print(message)
        warnings += 1

if warnings == 0:
    print("Looking good!")
else:
    print("Houston, we may have a problem!")
```

[Linux]: https://www.raspberrypi.org/downloads/
[FreeBSD]: https://wiki.freebsd.org/FreeBSD/arm/Raspberry%20Pi
[Windows 10 IoT]: https://blogs.windows.com/buildingapps/2016/02/29/windows-10-iot-core-support-for-raspberry-pi-3/
[current (mA) requirements]: https://www.raspberrypi.org/documentation/hardware/raspberrypi/power/README.md
[Raspbian]: https://www.raspbian.org/
[`vcgencmd`]: https://elinux.org/RPI_vcgencmd_usage
[Raspberry Pi forum post]: https://www.raspberrypi.org/forums/viewtopic.php?f=63&t=147781&start=50#p972790
[Raspberry Pi firmware commit comment]: https://github.com/raspberrypi/firmware/commit/404dfef3b364b4533f70659eafdcefa3b68cd7ae#commitcomment-31620480
[Python]: https://docs.python.org/3.5/library/functions.html#bin
