---
layout: post
title : seajs实战参考
description : 该页面列举了 SeaJS 中的常用实战过程中的问题，如全局接口，时间戳管理等实战性问题。只要掌握这些方法，就可以娴熟地开始对你的网站进行模块化开发了。
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
	
	//init.js
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

##seajs里版本号和时间戳问题
用 seajs 组织项目，上线后，经常需要更新特定文件或所有文件的时间戳，以清空浏览器缓存。最简单的方式是：

	//用来维护 jquery 等类库模块的版本号
	seajs.config({
	  alias: {
	    'jquery': 'jquery/1.6.2/jquery',
	    'backbone': 'backbone/0.5.1/backbone',
	    'a': 'a.js?20110801',
	    'b': 'b.js?20110801'
	  }
	});	
	
	//利用 map,批量更新时间戳是最方便的
	seajs.config({
	  'map': [
	    [ /^(.*\.(?:css|js))(.*)$/i, '$1?20110801' ]
	  ]
	});	

##条件加载

第一种：把依赖的模块都在 define 头部手工声明，不再依赖 SeaJS 的自动解析功能。这个模块同时依赖 play 和 work 两个模块，加载器会把这两个模块文件都下载下来。如果需要在 require 模块之后串行执行代码，那么只能用这个方式。

	define(['play', 'work'], function(require, exports) {
		 //是出去玩，还是工作？
	    var choice = require(condition() ? 'play' : 'work');
		//选择的难度
	    console.log(choice.hard());
	});

第二种：使用 require.async 来进行条件加载，从静态分析的角度来看，require.async适合需要执行动态加载的模块很大（比如大量 json 数据），不适合都下载下来。但是require.async 方式加载的模块，不能打包工具找到，自然也不能被打包进上线的 js 中；而前一种方式可以。

	define(function(require, exports) {
	    require.async(condition() ? 'play' : 'work', function(choice) {
	        console.log(choice.hard());
	    });
	});