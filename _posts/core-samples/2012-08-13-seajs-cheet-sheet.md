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


###可写成如下
    seajs.config({
      alias: {
        'jquery': 'http://modules.seajs.org/jquery/1.7.2/jquery.js'
      }
    });

    define('hi', function(require, exports) {
        exports.sayHi = function() {
            alert('hi')
        } 
    })

    seajs.use(['jquery', 'hi'], function($, h) {
        $('#beautiful-sea').click(h.sayHi)
    });


##实际使用中    
在工程内使用seajs，以前引用的插件、模块也都要用define的语法重新进行封装，比较麻烦，老代码可以不修改，继续使用就好。但强烈建立花点时间都修改成 CMD 模块，这样对以后的维护，以及页面性能很有好处。不然以后修改起来估计会更麻烦。

其实可以混用的，比如：

	<script src="jquery.js"></script>
	<script src="underscore.js"></script>
	<script src="backbone.js"></script>
	
	<script src="sea.js"></script>

这样，常用的 jquery 等类库，依旧是传统的用法，用全局变量引用就好，通过同步引入的方式，也不会有依赖顺序问题。
自己的代码，都按照 CMD 规范写成模块的形式。

其实上面的方式挺好的，特别对于要兼容老代码的情况的。
推荐还是都彻底模块化，看起来要多写一些 require，但值得，因为这样可以让每个模块自身的信息完整，从而减少对
环境的依赖，对后续的可维护性很好益处。


##seajs官方api

[详细官方文档](http://seajs.org/docs/#api)

[模块系统](https://github.com/seajs/seajs/issues/240)

[CMD 模块定义规范](https://github.com/seajs/seajs/issues/242)

[模块标识](https://github.com/seajs/seajs/issues/258)

[require 书写约定](https://github.com/seajs/seajs/issues/259)

[模块加载器](https://github.com/seajs/seajs/issues/260)

[配置](https://github.com/seajs/seajs/issues/262)

[常用插件](https://github.com/seajs/seajs/issues/265)

[打包部署](https://github.com/seajs/seajs/issues/281)

[快速参考](https://github.com/seajs/seajs/issues/266)