---
layout: post
title : css盒模型
description : 前端就是需要温故而知新，好好整理下前端基础知识，此偏讲讲css盒模型，巩固下基础知识。
category : css
tags : [css, 盒模型, DOCTYPE, box model]
---
{% include JB/setup %}

css:层叠样式表（Cascading Style Sheets）

代码如下：[http://www.heiniuhaha.com/test/css-box-model/css-box-model.html](http://www.heiniuhaha.com/test/css-box-model/css-box-model.html)

chrome测试图：

![chrome测试图](http://www.heiniuhaha.com/test/css-box-model/css-box-model-chrome.png)

###总结：

在标准模式前提下，

box=contentWidth+padding+margin+border；

div的背景颜色充满了padding和border，border透明时，可发现背景颜色就是div的bgcolor.

### 备注：

- <!DOCTYPE> is not an HTML tag. It is an information (a declaration) to the browser about what version the HTML is written in. 声明帮助浏览器正确地显示网页。

- HTML 4.01 规定了三种文档类型：Strict、Transitional 以及 Frameset。

###参考
- [css box model](http://www.w3schools.com/css/css_boxmodel.asp)