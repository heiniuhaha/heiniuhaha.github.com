---
layout: post
title : 使用github+pages+jekyll搭建blog环境
category : lessons
tags : [github, pages, blog, jekyll]
---
{% include JB/setup %}

也来讲讲怎么使用github pages做blog环境

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
		