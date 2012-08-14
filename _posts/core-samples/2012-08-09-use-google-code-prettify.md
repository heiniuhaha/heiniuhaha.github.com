---
layout: post
category : lessons
description : 看了jekyll的代码高亮插件pygments,觉得配置太复杂,就用了轻量级的google-code-prettify,使用非常方便.
tags : [google-code-prettify, 代码高亮, highlight, jekyll]
---
{% include JB/setup %}

##jekyll中代码高亮 google-code-prettify
看了jekyll的代码高亮插件pygments,觉得配置太复杂,就用了轻量级的google-code-prettify,使用非常方便.
- 先下载用于高亮代码的文件包,点击[google-code-prettify下载地址](http://code.google.com/p/google-code-prettify/downloads/list)下载small版本的代码.
- 复制进相应的目录,找到default.html

		/Users/heiniu/.ssh/heiniuhaha.github.com/_includes/themes/default.html
	
- 打开default.html,在最后面添加相应的代码

    	<script type="text/javascript" src="{{ page.staticpath }}js/code/prettify.js"></script>
    	<script type="text/javascript" src="{{ page.staticpath }}js/jquery-1.8.0.min.js"></script>
    	<script type="text/javascript">
	      $(function(){
	        $("pre").addClass("prettyprint linenums");
	        prettyPrint();
	        $('.entry a').each(function(){
	          if($(this).attr("href").indexOf("heiniuhaha") == -1){
	            $(this).attr("target", "_blank");
	          }
	        })
	      });
    	</script>

