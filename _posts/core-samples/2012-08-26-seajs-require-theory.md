---
layout: post
title : seajs模块依赖的加载处理
description : 比如执行init.js时，init.js、jquery.plugA.js、jquery.plugB.js都会依赖到jquery，那么这种情况下seajs对jquery如何处理的呢？只执行一次？执行多次？还是其他方式？
category : seajs
tags : [seajs, 依赖, 模块, 原理, 异步加载, cache, 接口]
---
{% include JB/setup %}

###seajs模块依赖问题
最近在做项目的时候发现一些关于模块依赖问题，特记录下:

比如现有3个文件：

	/*init.js*/
	define(function(require, exports, module){
		require('jquery');
		require('jquery.plugA');
	})
	
	/*jquery.plugA.js*/
	define(function(require, exports, module){
		require('jquery');
		require('jquery.plugB');
		//code...
	})
	
	/*jquery.plugB.js*/
	define(functioin(require, exports, module){
		require('jquery');
		//code...
	})


比如执行init.js时，init.js、jquery.plugA.js、jquery.plugB.js都会依赖到jquery，那么这种情况下seajs对jquery如何处理的呢？只执行一次？执行多次？还是其他方式？

此处参考玉伯的回答：
>我对模块调用的理解是，调用是指获取某个模块的接口。在 SeaJS 里，只有 seajs.use, require.async, 和 require 会产生
模块调用，比如：
`var a = require('./a')`
在执行 require('./a') 时，会获取模块的接口，如果是第一次调用，会初始化模块 a，以后再调用时，直接返回模块 a 的接口
define 只是注册模块信息，比如打包之后：
`define(id, deps, factory)`
是注册了一个模块到 seajs.cache 中，define 类似：
`seajs.cache[id] = { id: id, dependencies: deps, factory: factory }`

>是纯注册信息。

>而 `require('./a')` 时，才会执行 `seajs.cache['a'].factory`, 执行后得到 `seajs.cache['a'].exports`

>


###扩展：URI与URL的区别
URI:Uniform Resource Identifiers ，统一资源标识符；

URL:Uniform Resource Locators ，统一资源定位符；

URN:Uniform Resource Names，统一资源名称

URL,URN是URI的子集.

###参考
- Module.STATUS的具体含义：[https://github.com/seajs/seajs/issues/303](https://github.com/seajs/seajs/issues/303)
- 分清 URI、URL 和 URN[http://www.ibm.com/developerworks/cn/xml/x-urlni.html](http://www.ibm.com/developerworks/cn/xml/x-urlni.html)