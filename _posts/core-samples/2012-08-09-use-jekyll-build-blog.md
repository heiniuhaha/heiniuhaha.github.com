---
layout: post
title : 使用github+pages+jekyll搭建blog环境
description : 讲讲怎么使用github pages做blog环境,给自己做个记录，也给大家提供教程，分享交流
category : lessons
tags : [github, pages, blog, jekyll]
---
{% include JB/setup %}

也来讲讲怎么使用github pages做blog环境

##命令

1.  ### git命令获取远程文件

		git clone git@github.com:heiniuhaha/heiniuhaha.github.com.git
	
2.  ### 定位到目录`heiniu.github.com`

		cd .ssh/heiniuhaha.github.com
		
3.  ### 使用`rake`命令

		rake page           # Create a new page.
		rake post           # Begin a new post in ./_posts
		rake preview        # Launch preview environment
	
4. ### 写文章的时候学习下[markdown语法](https://github.com/othree/markdown-syntax-zhtw/blob/master/basics.md)
	 如:中文单引号 &#96; 用来标注小块代码,如`github` `jekyll`
	 
5. ### 最后提交git代码
		git add .
		git commit . -m 'just another commit'
		
		
##参考文章
[使用Github Pages建独立博客](http://beiyuu.com/github-pages/)
[使用github作为博客引擎](http://blog.leezhong.com/tech/2010/08/25/make-github-as-blog-engine.html)
[The Quickest Way to Blog with Jekyll.](http://jekyllbootstrap.com/)


##附件：git api 总结图
![git api 总结图](/assets/themes/twitter/pic/git-api.png)