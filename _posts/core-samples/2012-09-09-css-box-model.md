---
layout: post
title : IE盒模型与W3C盒模型浅总结
description : 前端就是需要温故而知新，好好整理下前端基础知识，此偏讲讲IE盒模型和W3C标准盒模型差异，巩固下基础知识。同时总结下border区域是否会填充背景色。
category : css
tags : [css, 盒模型, IE, W3C, DOCTYPE, border, backgroundColor, Quirks]
---
{% include JB/setup %}

css:层叠样式表（Cascading Style Sheets）

###demo：

- [http://www.heiniuhaha.com/demo/css-box-model/css-box-model-W3C.html](http://www.heiniuhaha.com/demo/css-box-model/css-box-model-W3C.html) 声明doctype

- [http://www.heiniuhaha.com/demo/css-box-model/css-box-model-IE.html](http://www.heiniuhaha.com/demo/css-box-model/css-box-model-IE.html) 不声明doctype

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

![chrome测试图](http://www.heiniuhaha.com/demo/css-box-model/css-box-model-chrome.png)

IE6测试图-IE盒模型和W3C标准盒模型对比图：

![IE6测试图-标准和非标准](http://www.heiniuhaha.com/demo/css-box-model/box-ie6.png)

###盒模型示意图
- ####IE盒模型

![IE盒模型](http://www.heiniuhaha.com/demo/css-box-model/p2.gif)

- ####W3C标准盒模型

![W3C标准盒模型](http://www.heiniuhaha.com/demo/css-box-model/p3.gif)

###总结：

IE盒模型占总空间=contentWidth，内容区只占了一小部分空间；

w3c标准盒模型占总空间=contentWidth+padding+margin+border；

同时：div的背景颜色充满了padding和border区域，border透明时，可发现背景颜色就是div的bgcolor.（ie6不支持透明transparent）

###触发盒模型
IE6 IE7 IE8 IE9 在Quirks怪异模式下，盒模型是一模一样的，都是IE盒模型，即总width=width;

IE6 IE7 IE8 IE9 在标准模式下，盒模型也是一模一样的，都是W3C盒模型， 即总width=width+padding+border;

非IE下的浏览器，如FF、chrome都采用标准模式渲染，都是W3C盒模型， 即总width=width+padding+border;

###border区域是否填充背景色
border区域不填充背景色图

![border区域不填充背景色](http://www.heiniuhaha.com/demo/css-box-model/border-transparent-ie7.png)

border区域填充背景色图

![border区域填充背景色](http://www.heiniuhaha.com/demo/css-box-model/border-transparent-ie8.png)

####标准模式下
- 非IE浏览器下，div的背景颜色充满了padding和border。border透明时，可发现border区域填充了背景色。

- IE8和IE9在标准模式下，和非IE浏览器渲染一致，border区域填充背景色；

- IE6 IE7标准模式下，border区域不填充背景色；

####非标准模式下
- IE6 IE7 IE8 IE9在Quirks怪异模式下，border区域都不会填充背景色；

### 备注：

- <!DOCTYPE> is not an HTML tag. It is an information (a declaration) to the browser about what version the HTML is written in. 声明帮助浏览器正确地显示网页。

- HTML规定了三种文档类型：Strict、Transitional 以及 Frameset。

- 在没有声明doctype的情况下，浏览器选择自己的模式，怪异模式(QUICK MODE)

###参考
- [w3schools.com css box model](http://www.w3schools.com/css/css_boxmodel.asp)
- [IE6与W3C标准的盒模型差异](http://blog.csdn.net/ncode/article/details/7428746)