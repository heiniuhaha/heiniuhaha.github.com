---
layout: post
title : ruby更新版本
description : ruby更新最新版本难倒了不少新人，其实用rvm就可以很好的进行ruby版本控制，能满足日常的开发需求。
category : ruby
tags : [ruby, 部署, 更新]
---
{% include JB/setup %}

经常有人问：
怎么把mac默认的ruby版本切换到刚安装的新版本？

答案很简单，用rvm吧

- rvm官方地址 [https://rvm.io/](https://rvm.io/)
- ruby更新实用详细教程  [http://ruby-china.org/wiki/rvm-guide](http://ruby-china.org/wiki/rvm-guide)

常用命令如下：

安装rvm

	curl -L https://get.rvm.io | bash -s stable --ruby
	
将系统重置为最新版本

	source ~/.bashrc
	
查看系统里的ruby版本

	which -a ruby

列出所有ruby版本	

	rvm list known
	
使用一个ruby版本

	rvm use 1.8.7
	
非常简单，即使是mac新人，使用此命令进行版本控制也无任何压力啊。
	
