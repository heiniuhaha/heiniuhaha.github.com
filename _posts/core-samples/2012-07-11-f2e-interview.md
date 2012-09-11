---
layout: post
title : 	前端面试题
description : 据说是腾讯的前端面试题，自勉下。
category : css
tags : [css, js, html]
---
{% include JB/setup %}

####★列出display的值 
 
可用值 值的说明

- block 象块类型元素一样显示。
- none 缺省值。向行内元素类型一样显示。
- inline-block 象行内元素一样显示，但其内容象块类型元素一样显示。
- list-item 象块类型元素一样显示，并添加样式列表标记。
- table-header-group 显示在任何表格行和行组合之前，在头部标题之后。
- table-footer-group 显示在任何表格行和行组合之后，在底部标题前。

####★清除浮动与闭合浮动的不同点
[http://www.cnblogs.com/mofish/archive/2012/05/14/2499400.html](http://www.cnblogs.com/mofish/archive/2012/05/14/2499400.html)

####★如何为元素绑定事件（就是addEvent）

	function addEvent(elm, evType, fn, useCapture) {
	  if (elm.addEventListener) {
	    elm.addEventListener(evType, fn, useCapture);//DOM2.0
	    return true;
	  }else if (elm.attachEvent) {
	    var r = elm.attachEvent('on' + evType, fn);//IE5+
	    return r;
	  }else {
	    elm['on' + evType] = fn;//DOM 0
	  }
	}


####★window.onbeforeunload 的用法 
[http://www.cnblogs.com/snandy/archive/2012/05/03/2481019.html](http://www.cnblogs.com/snandy/archive/2012/05/03/2481019.html)

####★说一下window.onerror的参数
[http://blog.csdn.net/zzxll5566/article/details/6187943](http://blog.csdn.net/zzxll5566/article/details/6187943)


####★列出IE与FF的事件对象的不同点 
[http://www.ok12.net/js/125.html](http://www.ok12.net/js/125.html)

####★如何用CSS画三角形 
(利用border属性)

####★你平时是如何调试JS代码的 
(firebug,IE开发人员工具,opera, chrome是当中最好的)

####★如何判定一个脚本是否加载成功 

	var script = document.createElement('script') ;
	var head = document.getElementsByTagName("head")[0];
	head.insertBefore(script, head.firstChild);//规避IE6下自闭合base标签BUG
	script.onload = script.onreadystatechange = function(){//先绑定事件再指定src发出请求
	    if(/loaded|complete|undefined/.test(this.readyState) && !this.once ){
	        this.once = 1;
	        this.parentNode.removeChild(this);
	    }
	}
	script.src = 'http://files.cnblogs.com/rubylouvre/html5.js'

(IE onreadystatechange事件,判定节点的readyState值是否为loaded或complete, 其他浏览器则使用onload)


####★如何判定iframe里面的资源都加载完毕
[http://www.cnblogs.com/lhgstudio/archive/2010/10/24/1859946.html](http://www.cnblogs.com/lhgstudio/archive/2010/10/24/1859946.html)

####★怎么判定一个节点是在DOM树中 
[http://www.cnblogs.com/rubylouvre/archive/2009/10/14/1583523.html](http://www.cnblogs.com/rubylouvre/archive/2009/10/14/1583523.html)


####★指出JS拖动的原理
(将元素绝对定位,一点点地改变其top,left样式来实现移动的效果,top,left可以通过鼠标获取)

####★说一下css transform2D与transform3D的区别
(一个是2*3矩阵,一个是4*4矩阵,transform3D支持GPU硬件加速,更加流畅,建议用transform3D模拟transform2D)


####★指出{}+[]与[]+{}的值,为什么 
(第一个为0,因为{}放在语句在前面,JS引擎认为它只是一个块,不是空对象,相当于+[] ===> +"" ==> 0, 第二个是"[object Object]",两者取toString(),然后相加)


####★说一下浏览器资源加载的情况,IE与其他浏览器各版本的不同之外
[http://www.otakustay.com/browser-strategy-loading-external-resource/](http://www.otakustay.com/browser-strategy-loading-external-resource/)

####★说一下最近非常流行模块加载,大概是怎么实现的,有什么好处
[http://www.cnblogs.com/muguaworld/archive/2011/11/27/2265356.html](http://www.cnblogs.com/muguaworld/archive/2011/11/27/2265356.html)