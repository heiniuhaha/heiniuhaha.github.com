---
layout: post
title : css盒模型
description : 前端就是需要温故而知新，好好整理下前端基础知识，此偏讲讲ie6和W3C标准浏览器的css盒模型差异，巩固下基础知识。
category : css
tags : [css, 盒模型, DOCTYPE, box model]
---
{% include JB/setup %}

css:层叠样式表（Cascading Style Sheets）

demo：[http://www.heiniuhaha.com/test/css-box-model/css-box-model.html](http://www.heiniuhaha.com/test/css-box-model/css-box-model.html)

code ：

	<style> 
		div{
			background-color:red;
			width:300px;
			height:300px;
			padding:20px;
			margin:100px;
			border:10px solid #000;
		}
		/*ie6不支持透明transparent*/
		.box2{border-color:transparent}
	</style>
	
	<div></div>
	<div class="box2"></div>
chrome测试图：

![chrome测试图](http://www.heiniuhaha.com/test/css-box-model/css-box-model-chrome.png)

###盒模型示意图

![ie6非标准盒模型](http://www.heiniuhaha.com/test/css-box-model/p2.gif)
![W3C标准盒模型](http://www.heiniuhaha.com/test/css-box-model/p3.gif)

###总结：

ie6非标准盒模型占总空间=contentWidth；

w3c标准盒模型占总空间=contentWidth+padding+margin+border；

同时：div的背景颜色充满了padding和border区域，border透明时，可发现背景颜色就是div的bgcolor.（ie6不支持透明transparent）

### 备注：

- <!DOCTYPE> is not an HTML tag. It is an information (a declaration) to the browser about what version the HTML is written in. 声明帮助浏览器正确地显示网页。

- HTML规定了三种文档类型：Strict、Transitional 以及 Frameset。

###参考
- [w3schools.com css box model](http://www.w3schools.com/css/css_boxmodel.asp)
- [IE6与W3C标准的盒模型差异](http://blog.csdn.net/ncode/article/details/7428746)