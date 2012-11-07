---
layout: post
title : 【转】jQuery 模块介绍与 jQuery 插件的深度模块化
description : 我们可以通过简单封装，让 jQuery 与jQuery的插件 成为 seajs 的模块。这样，调用时只要 require 即可。转自玉伯 【jQuery 模块介绍与 jQuery 插件的深度模块化】,方便不能翻墙的同学查看。
category : seajs
tags : [jquery, jqueryPlugin, seajs, 模块化, 代码组织, 性能优化]
---
{% include JB/setup %}


转自玉伯 [jQuery 模块介绍与 jQuery 插件的深度模块化](http://lifesinger.wordpress.com/2011/08/19/jquery-introduction-and-plugins-modulization/),方便不能翻墙的同学查看。
##jQuery模块
大名鼎鼎的 jQuery 就不多介绍了，详细介绍推荐官网：jquery.com
阮一峰最近整理的文章也不错，推荐：[jQuery 设计思想](http://www.ruanyifeng.com/blog/2011/07/jquery_fundamentals.html), [jQuery 最佳实践](http://www.ruanyifeng.com/blog/2011/08/jquery_best_practices.html)

几点感悟：

1. jQuery 是 DOM 操作类库，其核心功能是找到 DOM 元素并对其进行操作。
2. 拿 jQuery 与 YUI, Dojo 等框架相比是不公平的，就如拿轮胎和汽车相比一样。jQuery 只是一个轮胎，功能很单一，YUI 和 Dojo 等则是相对完整的汽车，除了轮胎，还有引擎、外壳等等。
3. 说 jQuery 不适合构建大型应用，就如说轮胎不适合参加赛车比赛一样不合逻辑。你可以用 jQuery 做轮胎，然后选择其他部件组合起来去 DIY 一辆赛车。能否胜出，得看赛车手的 DIY 水准。
4. jQuery的困局在于 DIY 高手不多，经常是一个好轮胎挂上一堆破破烂烂的外壳就上前线了。jQuery 的破局也在于 DIY. DIY 意味着灵活、可替换性，意味着可快速前行和高性能。
5. jQuery 灵活性带来的缺陷，比如有可能由选择器和链式风格导致的低效 DOM 操作，目前在提供了同类功能的 YUI3 等类库中同样存在。这不是类库的问题，更多是因为使用者的经验欠缺导致的。就如一把优秀的菜刀，到了一个拙劣的厨子手中，依旧切不好菜一样。工具很重要，但更重要的是我们得提升自己的刀工。
6. 最后，回到第一点：jQuery 是 DOM 操作类库。非 DOM 操作，都是 jQuery 的辅助功能，不是 jQuery 的强项，就如菜刀不能当斧头用一样。

我们可以通过简单封装，让 jQuery 成为 CommonJS 的模块。这样，调用时只要 require 即可：

test.html:

	<script src="http://modules.seajs.com/libs/seajs/1.0.1/sea.js"></script>
	<script>
	seajs.use('./init');
	</script>

init.js:

	seajs.config({
	  alias: {
	    'juery': 'jquery/1.6.1/jquery'
	  }
	});
	
	define(function(require, exports, module) {
	  var $ = require('jquery');
	  // do something with jQuery
	});
	
##jQuery插件的模块化
jQuery 提供了 DOM 操作功能，在实际应用中，我们还需要 cookie, template, storage 等等一系列功能。这时可以从 jQuery 社区中寻找各种插件来完成。大部分插件通过 jQuery 插件的模块化 一文中提供的方法封装就好。

之前的封装方法，总结成一句话是：“jQuery 穿肠过，插件身上留”。正如 Kidwind 反馈的一样，每次“穿肠过”的时候都要运行一次插件代码，频繁调用某些插件时，会存在 CPU 浪费，还可能带来隐患：

> 假设有以下jquery插件a, b, c, d，它们之间的关系如下
> 
- b 依赖于 a
- c 依赖于 a
- d 依赖于 b c

> 假设页面使用到d插件，那么插件a将进行两次初始化，也就是会调用两次
`var $ = require('jquery');require('a')($);`
进行插件a的注册，当系统复杂时，重复的插件注册会不会影响系统的性能，同时会不会存在隐患？如插件b对引用的插件a进行了部分功能扩展，当引入插件c的时候又重新注册了插件a，那么插件b对插件a的扩展将不存在了，当然改写插件功能的实际情况也许不会存在，此处只是举个例子，说明隐患的存在。
如何避免重复的插件注册，可以避免隐患，同时获得更好的性能（避免了多次插件注册的运算耗时）。

面对这种情况，我们究竟应该如何做好 jQuery 插件的模块化？

jQuery 插件的形式

jQuery 插件一般可以总结为以下模板：

	(function($) {  
	  // Main plugin function
	  $.fn.PLUGIN = function(options) {
	    // snip...
	  };
	
	  // Public plugin function
	  $.fn.PLUGIN.FUNCT = function() {
	    // Cool JS action
	  };
	
	  // Default settings for the plugin
	  $.fn.PLUGIN.defaults = { /* snip... */ };
	
	  // Private function that is used within the plugin
	  // snip...
	})(jQuery);
	
简言之就是往 `$.fn` 上添加新成员，有部分插件还会往 `$` 上添加成员。

之前的“穿肠过”模块化方式，可以表示为：

	define(function() { return function($) {
	  $.fn.PLUGIN = ...
	}});
	
调用方式：

	define(function(require, exports) {
	  var $ = require('jquery');
	  require('some-jquery-plugin')($);
	
	  $(sth).PLUGIN(...);
	});
不是很直观，不够方便，还有前面提到的隐患。

深度模块化

为了更好的模块化，意味着我们要添加更多代码：

	define(function(require, exports, module) {
	  var $ = require('jquery').sub();
	
	  // Main plugin function
	  $.fn.PLUGIN = function(options) {
	    // snip...
	  };
	
	  // Public plugin function
	  $.fn.PLUGIN.FUNCT = function() {
	    // Cool JS action
	  };
	
	  // Default settings for the plugin
	  $.fn.PLUGIN.defaults = { /* snip... */ };
	
	  // Private function that is used within the plugin
	  // snip...
	
	  module.exports = $;
	});
这样封装后，调用变成：

	define(function(require, exports) {
	  var $ = require('jquery');
	  var PLUGIN = require('some-jquery-plugin');
	  PLUGIN(sth).PLUGIN(...);
	});
这样能解决之前提到的重复初始化问题，但是 `PLUGIN(sth).PLUGIN(…)` 的使用方式怪怪的。比如这个非常帅的 chosen 插件，按照上面的方式模块化后，调用方式为：

	chosen('#some-id').chosen();
虽然可用，但怎么看怎么别扭。这是因为 jQuery 是以 DOM 为中心的，代码的默认流程是找到要操作的 DOM 元素，然后对其进行操作。这种代码书写方式，对于模块后的插件来说，很别扭。更好的期待中的调用方式是：

	define(function(require, exports) {
	  var $ = require('jquery');
	  var Chosen = require('chosen');
	 
	  var chosen = new Chosen(selector, options);
	  chosen.doSth(...);
	});
理论上，我们甚至可以不知道 chosen 依赖 jQuery, 我们需要关心的只是 chosen 的 API. 上面这种理想的调用方式，需要我们对插件进行“深度”模块化：

some-jquery-plugin.js:

	define(function(require, exports, module) {
	  var $ = require('jquery');
	
	  // Main plugin function
	  function PLUGIN(selector, options) {
	    var els = $(selector);
	    // snip...
	  };
	
	  // Public plugin function
	  PLUGIN.FUNCT = function() {
	    // Cool JS action
	  };
	
	  // Default settings for the plugin
	  PLUGIN.defaults = { /* snip... */ };
	
	  // Private function that is used within the plugin
	  // snip...
	
	  module.exports = PLUGIN;
	});
也就是说，在 plugin 的代码里，我们并不对 $.fn 或 $ 进行扩展，只用 $ 来进行 DOM 操作而已，返回的是独立的 PLUGIN 对象，就和我们写普通的业务模块一样。这样，就实现预期中更优雅的调用方式。

jQuery 的插件机制，在模块化面前很鸡肋。jQuery 一直被冠以“不适合大型项目”，也和 jQuery 的这种插件机制有关系。这会导致大家都去污染 $.fn, 这就和污染全局变量一样。项目一大，冲突的概率，和调试的成本都会变大，很悲剧。

因此，推荐大家利用模块的机制去重构一部分好用的 jQuery 插件，目前 dew 项目里已经重新实现了 cookie 等部分模块。强烈推荐大家都参与进来，将自己喜欢的，常用的 jQuery 等插件迁移过来。或者推进插件作者直接修改源码，增加对 CommonJS 的支持。路漫漫，但众人拾柴火焰高，星火可燎原，期待大家的参与。

建议大家直接 fork dew 项目，可以将自己重构的模块 pull request 过来，邮件给 seajs(at)googlegroups.com 群组。讨论和 code review 后，就可以转成 dew 的正式模块。

等模块丰富起来，我们就可以有更多时间去做更意思的事情了。