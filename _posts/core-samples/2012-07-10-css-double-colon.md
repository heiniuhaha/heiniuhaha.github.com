---
layout: post
title : 伪元素与伪类
description : 前端就是需要温故而知新，好好整理下前端基础知识，此偏学习和认识css3的伪元素。
category : css
tags : [css, 伪元素, 伪类]
---
{% include JB/setup %}

####单冒号(`:`)用于CSS3伪类，双冒号(`::`)用于CSS3伪元素。

`::selection`是CSS3里的伪元素（pseudo-elements）

一个冒号是伪类，两个冒号是伪元素

伪类可以独立于文档的元素来分配样式，且可以分配给任何元素，逻辑上和功能上类类似，但是其是预定义的、不存在于文档树中且表达方式也不同，所以叫伪类。

伪元素所控制的内容和一个元素控制的内容一样，但是伪元素不存在于文档树中，不是真正的元素，所以叫伪元素。

伪类有：:first-child ，:link:，vistited，:hover:，active:focus，:lang

伪元素有：:first-line，:first-letter，:before，:after

###参考
[学习和认识CSS伪元素](http://sunflowamedia.com/blog/learn-pseudo-element/)