---
layout: post
title:  Add Color to Shell Scripts
date:   2018-12-06 05:00:00 -0500
categories: shell
---

I use shell scripts all the time for backup, cleanup, etc. Sometimes these scripts are long-running or include a lot of output from commands mixed with my own output. I like to distinguish my output by using colors. Errors stand out more when displayed in <span style="color: red">blood red</span>.

We can set our terminal output color using [tput]. Not all terminals are created equal so we first need to determine how many colors we have available. The `colors` sub-command will show us the available colors in our terminal.

```sh
➤  tput colors
256
```

Now let's see what all of these colors look like. We can loop through these like so:

```sh
for fg_color in {0..$(tput colors)}; do
  tput setaf $fg_color
  printf "Color $fg_color  "
done
```

Or if you'd like one line to paste into your terminal...

<pre class="highlight">
➤  for fg_color in {0..$(tput colors)}; do tput setaf $fg_color; printf &quot;$fg_color &quot;; done;
<font color="#000000">0 </font><font color="#AA0000">1 </font><font color="#00AA00">2 </font><font color="#AA5500">3 </font><font color="#0000AA">4 </font><font color="#AA00AA">5 </font><font color="#00AAAA">6 </font><font color="#AAAAAA">7 </font><font color="#555555">8 </font><font color="#FF5555">9 </font><font color="#55FF55">10 </font><font color="#FFFF55">11 </font><font color="#5555FF">12 </font><font color="#FF55FF">13 </font><font color="#55FFFF">14 </font><font color="#FFFFFF">15 </font><font color="#000000">16 </font><font color="#00005F">17 </font><font color="#000087">18 </font><font color="#0000AF">19 </font><font color="#0000D7">20 </font><font color="#0000FF">21 </font><font color="#005F00">22 </font><font color="#005F5F">23 </font><font color="#005F87">24 </font><font color="#005FAF">25 </font><font color="#005FD7">26 </font><font color="#005FFF">27 </font><font color="#008700">28 </font><font color="#00875F">29 </font><font color="#008787">30 </font><font color="#0087AF">31 </font><font color="#0087D7">32 </font><font color="#0087FF">33 </font><font color="#00AF00">34 </font><font color="#00AF5F">35 </font><font color="#00AF87">36 </font><font color="#00AFAF">37 </font><font color="#00AFD7">38 </font><font color="#00AFFF">39 </font><font color="#00D700">40 </font><font color="#00D75F">41 </font><font color="#00D787">42 </font><font color="#00D7AF">43 </font><font color="#00D7D7">44 </font><font color="#00D7FF">45 </font><font color="#00FF00">46 </font><font color="#00FF5F">47 </font><font color="#00FF87">48 </font><font color="#00FFAF">49 </font><font color="#00FFD7">50 </font><font color="#00FFFF">51 </font><font color="#5F0000">52 </font><font color="#5F005F">53 </font><font color="#5F0087">54 </font><font color="#5F00AF">55 </font><font color="#5F00D7">56 </font><font color="#5F00FF">57 </font><font color="#5F5F00">58 </font><font color="#5F5F5F">59 </font><font color="#5F5F87">60 </font><font color="#5F5FAF">61 </font><font color="#5F5FD7">62 </font><font color="#5F5FFF">63 </font><font color="#5F8700">64 </font><font color="#5F875F">65 </font><font color="#5F8787">66 </font><font color="#5F87AF">67 </font><font color="#5F87D7">68 </font><font color="#5F87FF">69 </font><font color="#5FAF00">70 </font><font color="#5FAF5F">71 </font><font color="#5FAF87">72 </font><font color="#5FAFAF">73 </font><font color="#5FAFD7">74 </font><font color="#5FAFFF">75 </font><font color="#5FD700">76 </font><font color="#5FD75F">77 </font><font color="#5FD787">78 </font><font color="#5FD7AF">79 </font><font color="#5FD7D7">80 </font><font color="#5FD7FF">81 </font><font color="#5FFF00">82 </font><font color="#5FFF5F">83 </font><font color="#5FFF87">84 </font><font color="#5FFFAF">85 </font><font color="#5FFFD7">86 </font><font color="#5FFFFF">87 </font><font color="#870000">88 </font><font color="#87005F">89 </font><font color="#870087">90 </font><font color="#8700AF">91 </font><font color="#8700D7">92 </font><font color="#8700FF">93 </font><font color="#875F00">94 </font><font color="#875F5F">95 </font><font color="#875F87">96 </font><font color="#875FAF">97 </font><font color="#875FD7">98 </font><font color="#875FFF">99 </font><font color="#878700">100 </font><font color="#87875F">101 </font><font color="#878787">102 </font><font color="#8787AF">103 </font><font color="#8787D7">104 </font><font color="#8787FF">105 </font><font color="#87AF00">106 </font><font color="#87AF5F">107 </font><font color="#87AF87">108 </font><font color="#87AFAF">109 </font><font color="#87AFD7">110 </font><font color="#87AFFF">111 </font><font color="#87D700">112 </font><font color="#87D75F">113 </font><font color="#87D787">114 </font><font color="#87D7AF">115 </font><font color="#87D7D7">116 </font><font color="#87D7FF">117 </font><font color="#87FF00">118 </font><font color="#87FF5F">119 </font><font color="#87FF87">120 </font><font color="#87FFAF">121 </font><font color="#87FFD7">122 </font><font color="#87FFFF">123 </font><font color="#AF0000">124 </font><font color="#AF005F">125 </font><font color="#AF0087">126 </font><font color="#AF00AF">127 </font><font color="#AF00D7">128 </font><font color="#AF00FF">129 </font><font color="#AF5F00">130 </font><font color="#AF5F5F">131 </font><font color="#AF5F87">132 </font><font color="#AF5FAF">133 </font><font color="#AF5FD7">134 </font><font color="#AF5FFF">135 </font><font color="#AF8700">136 </font><font color="#AF875F">137 </font><font color="#AF8787">138 </font><font color="#AF87AF">139 </font><font color="#AF87D7">140 </font><font color="#AF87FF">141 </font><font color="#AFAF00">142 </font><font color="#AFAF5F">143 </font><font color="#AFAF87">144 </font><font color="#AFAFAF">145 </font><font color="#AFAFD7">146 </font><font color="#AFAFFF">147 </font><font color="#AFD700">148 </font><font color="#AFD75F">149 </font><font color="#AFD787">150 </font><font color="#AFD7AF">151 </font><font color="#AFD7D7">152 </font><font color="#AFD7FF">153 </font><font color="#AFFF00">154 </font><font color="#AFFF5F">155 </font><font color="#AFFF87">156 </font><font color="#AFFFAF">157 </font><font color="#AFFFD7">158 </font><font color="#AFFFFF">159 </font><font color="#D70000">160 </font><font color="#D7005F">161 </font><font color="#D70087">162 </font><font color="#D700AF">163 </font><font color="#D700D7">164 </font><font color="#D700FF">165 </font><font color="#D75F00">166 </font><font color="#D75F5F">167 </font><font color="#D75F87">168 </font><font color="#D75FAF">169 </font><font color="#D75FD7">170 </font><font color="#D75FFF">171 </font><font color="#D78700">172 </font><font color="#D7875F">173 </font><font color="#D78787">174 </font><font color="#D787AF">175 </font><font color="#D787D7">176 </font><font color="#D787FF">177 </font><font color="#D7AF00">178 </font><font color="#D7AF5F">179 </font><font color="#D7AF87">180 </font><font color="#D7AFAF">181 </font><font color="#D7AFD7">182 </font><font color="#D7AFFF">183 </font><font color="#D7D700">184 </font><font color="#D7D75F">185 </font><font color="#D7D787">186 </font><font color="#D7D7AF">187 </font><font color="#D7D7D7">188 </font><font color="#D7D7FF">189 </font><font color="#D7FF00">190 </font><font color="#D7FF5F">191 </font><font color="#D7FF87">192 </font><font color="#D7FFAF">193 </font><font color="#D7FFD7">194 </font><font color="#D7FFFF">195 </font><font color="#FF0000">196 </font><font color="#FF005F">197 </font><font color="#FF0087">198 </font><font color="#FF00AF">199 </font><font color="#FF00D7">200 </font><font color="#FF00FF">201 </font><font color="#FF5F00">202 </font><font color="#FF5F5F">203 </font><font color="#FF5F87">204 </font><font color="#FF5FAF">205 </font><font color="#FF5FD7">206 </font><font color="#FF5FFF">207 </font><font color="#FF8700">208 </font><font color="#FF875F">209 </font><font color="#FF8787">210 </font><font color="#FF87AF">211 </font><font color="#FF87D7">212 </font><font color="#FF87FF">213 </font><font color="#FFAF00">214 </font><font color="#FFAF5F">215 </font><font color="#FFAF87">216 </font><font color="#FFAFAF">217 </font><font color="#FFAFD7">218 </font><font color="#FFAFFF">219 </font><font color="#FFD700">220 </font><font color="#FFD75F">221 </font><font color="#FFD787">222 </font><font color="#FFD7AF">223 </font><font color="#FFD7D7">224 </font><font color="#FFD7FF">225 </font><font color="#FFFF00">226 </font><font color="#FFFF5F">227 </font><font color="#FFFF87">228 </font><font color="#FFFFAF">229 </font><font color="#FFFFD7">230 </font><font color="#FFFFFF">231 </font><font color="#080808">232 </font><font color="#121212">233 </font><font color="#1C1C1C">234 </font><font color="#262626">235 </font><font color="#303030">236 </font><font color="#3A3A3A">237 </font><font color="#444444">238 </font><font color="#4E4E4E">239 </font><font color="#585858">240 </font><font color="#626262">241 </font><font color="#6C6C6C">242 </font><font color="#767676">243 </font><font color="#808080">244 </font><font color="#8A8A8A">245 </font><font color="#949494">246 </font><font color="#9E9E9E">247 </font><font color="#A8A8A8">248 </font><font color="#B2B2B2">249 </font><font color="#BCBCBC">250 </font><font color="#C6C6C6">251 </font><font color="#D0D0D0">252 </font><font color="#DADADA">253 </font><font color="#E4E4E4">254 </font><font color="#EEEEEE">255 256 </font><span style="background-color:#EEEEEE"><font color="#000000"><b>%</b></font></span> </pre>

The first eight colors are most likely available on the widest range of systems that are not monochrome. For this reason, our best bet is to choose the colors for our helper function from those first eight.

Now that we know what colors are available, let's create a function to include in our shell scripts for easily printing in our choice colors. A [BASH case statement] should work nicely for this.

```sh
colorprintf () {
	case $1 in
		"red") tput setaf 1;;
		"green") tput setaf 2;;
		"orange") tput setaf 3;;
		"blue") tput setaf 4;;
		"purple") tput setaf 5;;
		"cyan") tput setaf 6;;
		"gray" | "grey") tput setaf 7;;
	esac
	printf "$2";
	tput sgr0
}
```

In the above function we use the provided argument to determine the color we want to set, set that color output with `tput setaf`, and print the output with `printf`. Notice that we use `tput sgr0` at the end of the function which resets the output to default.

Now we are ready to `colorprintf`!

<pre class="highlight">
➤  colorprintf red &quot;This should be in red\n&quot;
<font color="#AA0000">This should be in red</font>
➤  colorprintf orange &quot;This should be in orange\n&quot;
<font color="#AA5500">This should be in orange</font>
➤  colorprintf cyan &quot;This should be in cyan\n&quot;
<font color="#00AAAA">This should be in cyan</font>
➤  colorprintf purple &quot;This should be in purple\n&quot;
<font color="#AA00AA">This should be in purple</font>
</pre>

I've successfully used this function in Bash and Zsh but it should work in most modern Unix shells.

[tput]: https://en.wikipedia.org/wiki/Tput
[BASH case statement]: http://tldp.org/LDP/Bash-Beginners-Guide/html/sect_07_03.html
