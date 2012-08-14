---
layout: post
title : seajs快速参考
description : 学习使用seajs+jquery进行模块化开发
category : seajs
tags : [seajs, 模块化, 代码组织, 性能优化]
---
{% include JB/setup %}

## seajs快速参考 ##
该页面列举了 SeaJS 中的常用 API。只要掌握这些方法，就可以娴熟地进行模块化开发。

###启动模块系统
	<script src="http://modules.seajs.org/seajs/1.2.0/sea.js"></script>
	<script>
	  	seajs.use('./main');
		seajs.use(['./a', './b'], function(a, b) {
		  a.init();
		  b.init();
		});	  
	</script>
	
	//callback 参数是可选的。当只启动加载一个模块，且不需要 callback 时，可以用 data-main 属性来简化：
	<script src="http://modules.seajs.org/seajs/1.2.0/sea.js" data-main="./main"></script>
	
	/*
	引入 sea.js 时，可以把 sea.js 与其他文件打包在一起，提前打包好，或利用 combo 服务动态打包。
	无论哪一种方式，为了让 sea.js 内部能快速获取到自身路径，推荐手动加上 id 属性：
	加上 seajsnode 值，可以让 sea.js 直接获取到自身路径，而不需要通过其他机制去自动获取。
	这对性能和稳定性会有一定提升，推荐默认都加上。
	*/
	<script src="path/to/sea.js" id="seajsnode"></script>

###seajs.config
	//seajs.config 可以叠加，可以在多处调用，同名 key 覆盖，不同名的 key 叠加。这样可以做到：区域配置可以覆盖通用配置或可以说在区域配置中可对 seajs config 再做按需配置而不会影响到通用配置。
	seajs.config({
	
	  //alias最常用来做版本配置与管理，也可以用来做命名空间管理。
	  alias: {
	    'es5-safe': 'es5-safe/0.9.2/es5-safe',
	    'json': 'json/1.0.1/json',
	    'jquery': 'jquery/1.7.2/jquery'
	  },
	  
	  /*
	  使用 preload 配置项，可以在普通模块加载前，提前加载并初始化好指定模块。
	  注意：preload 中的配置，需要等到 use 时才加载。
	  preload 配置不能放在模块文件里面
	  */
	  preload: [
	    Function.prototype.bind ? '' : 'es5-safe',
	    this.JSON ? '' : 'json'
	  ],
	  
	  //值为 true 时，加载器会使用 console.log 输出所有错误和调试信息。 默认为 false, 只输出关键信息
	  debug: true,
	  
	  //该配置可将某个文件映射到另一个。可用于在线调试，非常方便。
	  map: [
	    ['http://example.com/js/app/', 'http://localhost/js/app/']
	  ],
	  
	  /*
	  SeaJS 在解析顶级标识时，会相对 base 路径来解析。
	  注意：一般请不要配置 base 路径，保持默认往往最好最方便。
	  base 路径的默认值，与 sea.js 的访问路径相关：
	  如果 sea.js 的访问路径是：
	    http://example.com/js/libs/sea.js
	  则 默认base 路径为：
	    http://example.com/js/libs/	 
	  */ 
	  base: 'http://example.com/path/to/base/',
	  
	  //获取模块文件时，<script> 或 <link> 标签的 charset 属性。 默认是 utf-8 。
	  charset: 'utf-8'	  
	});
	
	

###seajs.use
	/*
	模块加载器
	seajs.use 理论上只用于加载启动，不应该出现在 define 中的模块代码里。在模块代码里需要异步加载其他模块时，可以使用 require.async 方法。
	*/

	seajs.use('./a');
	
	seajs.use('./a', function(a) {
	  a.doSomething();
	});
	
	seajs.use(['./a', './b'], function(a, b) {
	  a.doSomething();
	  b.doSomething();
	});
	
	//seajs.use 与 dom ready 事件没有任何关系。
	//如果某些操作要确保在 dom ready 后执行，需要自己使用 jquery 等类库来保证
	seajs.use(['jquery', 'page'], function($, page) {
	  $(function() {
	    page.init()
	  })
	})	

###define
	/*
	CMD 模块定义 define(factory);
	define 是全局函数，用来定义模块。
	在开发时，define 仅接收一个 factory 参数。
	factory 可以是一个函数，也可以是对象、字符串等类型。
	factory 为对象、字符串等非函数类型时，表示模块的接口就是该对象、字符串等值。
	factory 为函数时，表示模块的构造方法。执行该方法，可以得到模块向外提供的接口。
	*/
	define(function(require, exports, module) {
	
	  // The module code goes here
	
	});

###require
	/*
	require 是一个方法，用来获取其他模块提供的接口。
	require 接受 模块标识 作为唯一参数
	require 的参数值必须是字符串直接量,require("my-module");
	*/
	define(function(require) {
	  var a = require('./a');
	  a.doSomething();
	});

###require.async
	/*
	require.async(id, callback)
	async 方法可用来异步加载模块，并在加载完成后执行指定回调。
	
	推荐使用 require.async 来进行条件加载，从静态分析的角度来看，这个模块同时依赖 play 和 work 两个模块，加载器会把这两个模块文件都下载下来。
		if (todayIsWeekend)
		  require.async("play");
		else
		  require.async("work");	
	*/
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
	
###require.resolve
	/*
	require.resolve(id)
	使用模块系统内部的路径解析机制来解析并返回模块路径。该函数不会加载模块，只返回解析后的绝对路径。
	*/
	define(function(require, exports) {
	  console.log(require.resolve('./b')); 
	  // ==> 'http://example.com/js/b.js'
	});	

###exports
	/*
	exports 是一个对象，用来向外提供模块接口。
	exports 仅仅是 module.exports 的一个引用。
	在 factory 内部给 exports 重新赋值时，并不会改变 module.exports 的值。
	因此给 exports 赋值是无效的，不能用来更改模块接口，正确的写法是用 return 或者给 module.exports 赋值。
	exports = {}是错误的，module.exports ={}才是正确的写法。
	*/

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

###module
	/*
	module 是一个对象，上面存储了与当前模块相关联的一些属性和方法。
	*/
	define(function(require, exports, module) {
	
		//module.id 模块标识。require(module.id) 必然返回此模块的 exports 。
	   console.log(require(module.id) === exports); // true
	   
	   //module.uri根据模块系统的路径解析规则得到的模块绝对路径。
	   console.log(module.uri); // http://example.com/path/to/this/file.js
	   
	   //module.dependencies dependencies 是一个数组，表示当前模块的依赖列表。
	   
	   /*
	   module.exports 当前模块对外提供的接口。
	   module.exports 的赋值需要同步执行，不能放在回调函数里
	   */
	});


以上接口是最常用的，要牢记于心。


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


###模块化后的js写法
	define(function(require, exports, module) = {
	 
	    //原jquery.js代码...
	 
	    module.exports = $.noConflict(true);
	});
	 
	//init.js
	define(function(require, exports, module) = {
	    var $ = require('jquery');
	    var m1 = require('module1');
	     
	    exports.initPage = function() {
	        $('.content').html(m1.run());    
	    }
	});
	 
	//module1.js
	define(function(require, exports, module) = {
	    var $ = require('jquery');
	    var m2 = require('module2');
	    var m3 = require('module3');
	     
	    exports.run = function() {
	        return $.merge(['module1'], $.merge(m2.run(), m3.run()));    
	    }
	});
	 
	//module2.js
	define(function(require, exports, module) = {
	    exports.run = function() {
	        return ['module2'];
	    }
	});
	 
	//module3.js
	define(function(require, exports, module) = {
	    var $ = require('jquery');
	    var m4 = require('module4');
	     
	    exports.run = function() {
	        return $.merge(['module3'], m4.run());    
	    }
	});
	 
	//module4.js
	define(function(require, exports, module) = {
	    exports.run = function() {
	        return ['module4'];
	    }
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

##seaja+jquery
[直接调用 jQuery 插件等非标准模块的方法](https://github.com/seajs/seajs/issues/286)