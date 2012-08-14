---
layout: post
title : 使用github+jekyll+markdown搭建blog环境，完美替代wordpress
description : 讲讲怎么使用github pages做blog环境,给自己做个记录，也给大家提供教程，分享交流
category : lessons
tags : [github, pages, blog, jekyll]
---
{% include JB/setup %}

也来讲讲怎么使用github pages做blog环境

## 优点 ##

>空间免费，github托管，稳定又安全，遭遇过空间商跑路的朋友是不是想起伤心往事；

>允许本地服务器调试，脱离网络写文章毫无压力，因为可以使用git命令同步来管理文章，版本控制妥妥的，对技术人员来说，一键恢复，实在是神物；

>还能绑定顶级域名，亲，人家免费空间竟然还允许我们绑域名有木有~~；

>文章用markedown编写，以前遭受排版困扰的亲们是不是很激动；

## 购买域名 ##
可以去[万网](http://www.net.cn)，这两天正好在促销.
![net-cn-sales](/assets/themes/twitter/pic/net-cn-sales.png)

##用免费的dnsPod做域名解析
dnspod链接地址[https://www.dnspod.cn/](https://www.dnspod.cn/)
![dnspod settings](/assets/themes/twitter/pic/dnspod-setting.png)

##github注册和本地电脑jekyll等环境配置
参考最底下的参考文章，省略。。。


## 命令 ##

1.  ### git命令获取远程文件 ###

		git clone git@github.com:heiniuhaha/heiniuhaha.github.com.git
	
2.  ### 定位到目录`heiniu.github.com` ###

		cd .ssh/heiniuhaha.github.com
		
3.  ### 使用`rake`命令 ###

		rake page           # Create a new page.
		rake post           # Begin a new post in ./_posts
		rake preview        # Launch preview environment
	
4. ### 写文章的时候学习下[markdown语法](https://github.com/othree/markdown-syntax-zhtw/blob/master/basics.md) ###
	 如:中文单引号 &#96; 用来标注小块代码,如`github` `jekyll`
	 
5. ### 最后提交git代码 ###
		git add .
		git commit . -m 'just another commit'


		
## 日常发布完整命令 ##
	git clone git@github.com:heiniuhaha/heiniuhaha.github.com.git//本地如果无远程代码，先做这步，不然就忽略
	cd .ssh/heiniuhaha.github.com//定位到你blog的目录下
	git pull origin master //先同步远程文件，后面的参数会自动连接你远程的文件
	git status //查看本地自己修改了多少文件
	git add .//添加远程不存在的git文件
	git commit * -m "what I want told to someone"
	git push origin master //更新到远程服务器上
		
## 参考文章 ##

[使用Github Pages建独立博客](http://beiyuu.com/github-pages/)

[使用github作为博客引擎](http://blog.leezhong.com/tech/2010/08/25/make-github-as-blog-engine.html)

[The Quickest Way to Blog with Jekyll.](http://jekyllbootstrap.com/)


## 附件：git api 总结图 ##
链接：[http://www.heiniuhaha.com/assets/themes/twitter/pic/git-api.png](/assets/themes/twitter/pic/git-api.png)
![git api 总结图](/assets/themes/twitter/pic/git-api.png)