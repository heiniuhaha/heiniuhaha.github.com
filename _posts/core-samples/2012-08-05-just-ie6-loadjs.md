---
layout: post
title : 怎么让一个js文件只有是ie6的时候才加载
description : 很多时候，我们都需要给ie6做一些优雅降级的事儿，js和css都有。怎么才能简单又有效呢？
category : ie
tags : [ie, 异步加载, 无阻塞, 浏览器]
---
{% include JB/setup %}

有朋友问怎么让一个js文件只有是ie6的时候才加载，特记录下:

###方式一：利用`[if IE 6]`的判断方式

####code

	<!--[if IE 6]>	<script src="http://yourdomain.com/script.js"></script>	<![endif]-->

优点：简洁直观

缺点：阻塞加载

####`[if IE]`的浏览器判断

	1. <!--[if !IE]>除IE外都可识别 <![endif]-->
	2. <!--[if IE]> 所有的IE可识别 <![endif]-->
	3. <!--[if IE 5.0]> 只有IE5.0可以识别 <![endif]--> 
	4. <!--[if IE 5]> 仅IE5.0与IE5.5可以识别 <![endif]-->
	5. <!--[if gt IE 5.0]> IE5.0以及IE5.0以上版本都可以识别 <![endif]-->
	6. <!--[if IE 6]> 仅IE6可识别 <![endif]-->
	7. <!--[if lt IE 6]> IE6以及IE6以下版本可识别 <![endif]-->
	8. <!--[if gte IE 6]> IE6以及IE6以上版本可识别 <![endif]-->
	9. <!--[if IE 7]> 仅IE7可识别 <![endif]-->
	10. <!--[if lt IE 7]> IE7以及IE7以下版本可识别 <![endif]-->
	11. <!--[if gte IE 7]> IE7以及IE7以上版本可识别 <![endif]-->


按原意是

>`lt`：less than 当前指定版本以下，不包含当前版本

>`gt`：greater than 当前指定版本以上，不包含当前版本

>`lte`：less than or equal 当前指定版本以下，包含当前版本(等于)

>`gte`：greater than or equal 当前指定版本以上，包含当前版本(等于)


###方式二：js判断浏览器版本再异步加载

	(function() {
		 var isIE6= navigator.appVersion.indexOf("MSIE 6")>-1;
		 if(isIE6){
		     var s = document.createElement('script');
		     s.type = 'text/javascript';
		     s.async = true;
		     s.src = 'http://yourdomain.com/script.js';
		     var x = document.getElementsByTagName('script')[0];
		     x.parentNode.insertBefore(s, x);
		 }
	 })();

优点：适合于有洁癖的开发者，或是希望异步无阻塞加载。

缺点：代码量多，执行js效率差，如果是需要立即执行渲染的程序，此方式不适合。

###两种方式性能评测


###参考
- [MSDN](http://msdn2.microsoft.com/en-us/library/ms537512.aspx)
- [异步加载详解](http://han.guokai.blog.163.com/blog/static/1367182712011115105841181/)