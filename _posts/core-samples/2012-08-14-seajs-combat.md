---
layout: post
title : seajs快速参考
description : 学习使用seajs+jquery进行模块化开发
category : seajs
tags : [seajs, 模块化, 代码组织, 性能优化, 实战经验]
---
{% include JB/setup %}

## seajs实战参考 ##
该页面列举了 SeaJS 中的常用实战过程中的问题。只要掌握这些方法，就可以娴熟地开始对你的网站进行模块化开发了。

默认情况下，SeaJS 要求所有文件都是标准的 CMD 模块，但现实场景下，有大量 jQuery 插件等非 CMD 模块存在。在 SeaJS 里，通过以下方式，可以直接调用非标准模块。

###全站通用的要加载的库只写一次，而不想每个js里都调用，太繁琐
	//可以放在在 init.js 里暴露到全局，这样，所有在 init.js 之后载入的文件，就都可以直接通过全局变量来拿 $ 等对象。
	
	seajs.use('init')
	
	init.js
	define(function(require, exports) {
		var $ = jQuery = require('jquery');
		
		// 暴露到全局
  		window.$ = $;
	});

###1. 暴露 jQuery
jQuery 插件都依赖 jQuery 模块，为了加载 jQuery 插件，首先得将 jQuery 模块暴露出来：

	// 配置 jquery 并放入预加载项中
	seajs.config({
	  alias: {
	    'jquery': 'https://a.alipayobjects.com/static/arale/jquery/1.7.2/jquery.js'
	  },
	  preload: ["jquery"]
	})
	
	// 将 jQuery 暴露到全局
	seajs.modify('jquery', function(require, exports) {
	  window.jQuery = window.$ = exports
	})

###2. 修改 jQuery 插件的接口
我们以 jquery.cookie 插件为例。

	// 配置别名
	seajs.config({
	  alias: {
	    'cookie': 'https://raw.github.com/carhartl/jquery-cookie/master/jquery.cookie.js'
	  }
	})
	
	// 将 jQuery Cookie 插件自动包装成 CMD 接口
	seajs.modify('cookie', function(require, exports, module) {
	  module.exports = $.cookie
	})
	
### 3. 调用 Cookie 插件
这样，在其他模块中，就可以直接调用 cookie 插件了：

	a.js:
	
	define(function(require, exports) {
	  var cookie = require('cookie')
	
	  cookie('the_cookie')
	  cookie('the_cookie', 'the_value')
	
	  // ...
	})
完整范例：[http://seajs.org/test/issues/auto-transport/test.html](http://seajs.org/test/issues/auto-transport/test.html)

##参考文档
[直接调用 jQuery 插件等非标准模块的方法](https://github.com/seajs/seajs/issues/286)
[seajs中文版源码](http://www.heiniuhaha.com/api/sea-zh.js)