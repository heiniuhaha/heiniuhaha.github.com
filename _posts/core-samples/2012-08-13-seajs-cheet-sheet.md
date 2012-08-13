---
layout: post
title : seajs快速参考
description : 学习使用seajs+jquery进行模块化开发
category : seajs
tags : [seajs，模块化，代码组织，性能优化]
---
{% include JB/setup %}

## seajs快速参考 ##
该页面列举了 SeaJS 中的常用 API。只要掌握这些方法，就可以娴熟地进行模块化开发。

###seajs.config

		seajs.config({
		  alias: {
		    'es5-safe': 'es5-safe/0.9.2/es5-safe',
		    'json': 'json/1.0.1/json',
		    'jquery': 'jquery/1.7.2/jquery'
		  },
		  preload: [
		    Function.prototype.bind ? '' : 'es5-safe',
		    this.JSON ? '' : 'json'
		  ]
		});

###seajs.use

		seajs.use('./a');
		
		seajs.use('./a', function(a) {
		  a.doSomething();
		});
		
		seajs.use(['./a', './b'], function(a, b) {
		  a.doSomething();
		  b.doSomething();
		});

###define

		define(function(require, exports, module) {
		
		  // The module code goes here
		
		});

###require

		define(function(require) {
		  var a = require('./a');
		  a.doSomething();
		});

###require.async

		define(function(require, exports, module) {
		  // load one module
		  require.async('./b', function(b) {
		    b.doSomething();
		  });
		
		  // load multiple modules
		  require.async(['./c', './d'], function(c, d) {
		    // do something
		  });
		});

###exports

		define(function(require, exports) {
		  // snip...
		  exports.foo = 'bar';
		  exports.doSomething = function() {};
		});
		module.exports
		
		define(function(require, exports, module) {
		  // snip...
		  module.exports = {
		    name: 'a',
		    doSomething: function() {};
		  };
		});

这 7 个接口是最常用的，要牢记于心。