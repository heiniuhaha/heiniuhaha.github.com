---
layout: post
category : lessons
description : 应用推荐的themes发现的问题，我尝试了the-program的theme,但是出现一个使用iframe的警告,看了源文件,没有发现可修复的地方,直接放弃这个theme吧.
tags : [github, pages, blog, jekyll, theme]
---
{% include JB/setup %}

##应用themes发现的问题
我尝试了the-program的theme,但是出现一个使用iframe的警告,看了源文件,没有发现可修复的地方,直接放弃这个theme吧.

{{ page.staticpath }}


![theme iframe waring](/assets/themes/twitter/img/theme-iframe.png "theme iframe waring")
####**code:**
	For security reasons,framing is not allowed.
		
	<iframe src="http://markdotto.github.com/github-buttons/github-btn.html?user=plusjade&repo=jekyll-bootstrap&type=fork&count=true"></iframe>
		
所以我只能换成twitter皮肤,我想这个皮肤应该是最稳定的了.等使用熟练后再改成自己的皮肤.