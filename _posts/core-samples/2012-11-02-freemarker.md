---
layout: post
title : 	FreeMarker学习笔记
description : FreeMarker 是一款模板引擎:一种基于模板的、用来生成输出文本的通用工具。包括数组列表、模板、表达式、内建函数、文本输出等常见用法。
category : freemarker
tags : [FreeMarker, ftl, 模板]
---
{% include JB/setup %}

###1.freemarker中Request,Session的用法：  
java块:

	request.getSession().setAttribute("qq","http://www.qq.com");  
	request.setAttribute("qq", "http://www.qq.com");  

freemarker代码：  

	<#if Session ["qq"]?exists>//Request的用法同session  
	<#if Session ["qq"]=="http://www.qq.com">  
	<#else>  
	</#if>  
	<#else>  
	</#if>  
	
而通常情况下，Request和Session均可省去不写：  

	<#if qq?exists>//Request的用法同session  
		<#if qq=="http://www.qq.com">  
		<#else>  
		</#if>  
	<#else>  
	</#if>  
但是如果他们都设有相同的key值，那么在页面中显示的话，就就应该把他们加上去。  

###2.freemarker获取字数 

	<#assign content=root.keyWord>
    ${content?subString(0,100)}
    
或

    ${root.keyWord[0..100]} 

###3.判断集合：  
集合的集合： 
 
	<#if voteWraperObj.itemList?size gt 0>  
		<#list voteWraperObj.itemList as voteList>  
		</#list>              
	</#if>  
对象的集合：  

	<#if softDetail?size gt 0>  
		<#list softDetail as softlist>  
		</#list>  
	</#if>  
关于Session中存放的对象的属性的读取：  

	<#if Session ["userweb"].member?exists>  
	
判断数组是否存在
<#if list??>

###4.switch/case的用法：  
	<#switch type>  
		<#case "down">  
			<#include "softdown.ftl">  
			<#break>  
		<#case "photo">  
			<#if para=="photoSquare">  
				<#include "photo.ftl">  
			<#elseif para=="photoWidth">  
				<#include "photo.ftl">  
			<#else>  
			</#if>  
		<#break>  
	</#switch>  

###5.时间类型在页面是如何才能正常显示的：  
如：

	${newslist.pubTime?string('yyyy-MM-dd')}  
	${newslist.pubTime?string("yyyy-MM-dd HH:mm:ss")}   

###6.判断存在与否，以及是否有效：  
如：
	
	<#if goodslist.f_goods_url?exists&&goodslist.f_goods_url?length gt 0>  

###7."default"是如何使用的：  
如： 

	${qq?default("http://www.qq.com")}  
	//即如果属性qq不存在，那么就是要default中的值替代。  

###8.`<#assign>`的用法：  

	<#assign count=0>  
	<#assign str="12345">  
	<#list 0..9 as i>  
		<#assign count=count+1>   
		<#if i gt str?length>  
			${count}  
		</#if>  
	</#list>  
输出为：7 8 9 10  

###9.freemarker中如何截取字符串

`exp?substring(from, toExclusive)` 
`exp?substring(from)` 
实例：

	${'abc'?substring(0)}//abc
	${'abc'?substring(0, 3)} //abc
	${'abc'?substring(2, 3)} //c

###10.freemarker页面中如果包含  
	<#assign html=JspTaglibs["/WEB-INF/struts-html.tld"]>  
	<@html.base/>  
那么它所指向的路径都是相对路径(相对于当前文件)。  

###11.如何让freemarker模板当html来使用呢：（完整的页面如下）  
	<html>  
	<head>  
	    <#assign html=JspTaglibs["/WEB-INF/struts-html.tld"]>  
	    <#assign bean=JspTaglibs["/WEB-INF/struts-bean.tld"]>  
	    <#assign logic=JspTaglibs["/WEB-INF/struts-logic.tld"]>  
	    <@html.base/>  
	    <link href="css/main.css" rel="stylesheet" type="text/css" />  
	    <meta http-equiv="content-type" content="text/html; charset="utf-8">  
	 </head>  
	 <body>  
	    ---------freemarker代码块  
	 </body>  
	</html>  

###12.使用内建的int获得整数部分  
如`${1.1?int} = 1`  

###13.比较操作符： 
 
*  使用=（或==，完全相等）测试两个值是否相等，使用!= 测试两个值是否不相等。  
*  对数字和日期可以使用<、<=、>和>=，但不能用于字符串  
*  由于Freemarker会将>解释成FTL标记的结束字符，所以对于>和>=可以使用括号来避免这种情况，例如`<#if (x > y)>`，另一种替代的方法是，使用`lt`、`lte`、`gt`和`gte`来替代<、<=、>和>=  

###14.内建函数：  

- html：对字符串进行HTML编码  
- cap_first：使字符串第一个字母大写  
- lower_case：将字符串转换成小写  
- upper_case：将字符串转换成大写  
- trim：去掉字符串前后的空白字符  
- size：获得序列中元素的数目  
- int：取得数字的整数部分（如-1.9?int的结果是-1）  

###15.将表达式结果转换成文本输出
根据缺省格式（由#setting指令设置）将表达式结果转换成文本输出；可以使用内建函数string格式化单个Interpolation  
如：

	<#setting number_format="currency"/>  
	<#assign answer=42/>  
输出结果是：$42.00  
单个Interpolation：  

	${answer?string.number}  
	${answer?string.currency}  
	${answer?string.percent}

###16. 插入日期值：
根据缺省格式（由#setting指令设置）将表达式结果转换成文本输出；可以使用内建函数string格式化单个Interpolation  
如：

	${lastUpdated?string("yyyy-MM-dd HH:mm:ss zzzz")}

###17.Session中设置对象属性的判断：  
   	
   	Session ["userweb"].member?exists

###18. 插入布尔值：
根据缺省格式（由#setting指令设置）将表达式结果转换成文本输出；可以使用内建函数string格式化单个Interpolation.  
如：

	<#assign or=true/>  
	${or?string("You are right!", "You are wrong!")}  
输出为：You are right!  

###19. 格式化数字
数字Interpolation的#{expr; format}形式可以用来格式化数字，format可以是：  

- mX：小数部分最小X位  
- MX：小数部分最大X位  

如：

	<#assign x=2.582/>  
	<#assign y=4/>  
	#{x; M2}   <#-- 2.58 -->  
	#{y; M2}   <#-- 4    -->  
	#{x; m1}   <#-- 2.6 -->  
	#{y; m1}   <#-- 4.0 -->  
	#{x; m1M2} <#-- 2.58 -->  
	#{y; m1M2} <#-- 4.0 -->   

###20.用户定义指令：宏 
	 
	<#macro greet person>  
	<font size="+2">Hello ${person}!</font>  
	</#macro>   
作为用户定义指令使用宏变量时，使用@替代FTL标记中的#  
	
	<@greet person="Fred"/> and <@greet person="Batman"/>   
输出为：Hello Fred! and Hello Batman!   

###21： 宏可以有多参数：  
	<#macro greet person color>  
		<font size="+2" color="${color}">Hello ${person}!</font>  
	</#macro>  
可以这样使用该宏变量：  
	
	<@greet person="Fred" color="black"/>
其中参数的次序是无关的，只能使用在macro指令中定义的参数，并且对所有参数赋值，所以下面的代码是错误的：  
只能使用在macro指令中定义的参数，并且对所有参数赋值，多了或者少了都会出错的，完全赋值。
如：`<@greet person="Fred"/>`为错。  

可以在定义参数时指定缺省值，
  
	<#macro greet person color="black">  
		<font size="+2" color="${color}">Hello ${person}!</font>  
	</#macro>   
这样`<@greet person="Fred"/>`就正确了，宏的参数是局部变量，只能在宏定义中有效。  

###22. 嵌套内容   
用户定义指令可以有嵌套内容，使用<#nested>指令执行指令开始和结束标记之间的模板片  

	<#macro border>  
		<table border=4 cellspacing=0 cellpadding=4>
			<tr><td><#nested></td></tr>
		</table>  
	</#macro>   
这样使用该宏变量：  
  
	<@border>The bordered text</@border>  
输出结果：  

	<table border=4 cellspacing=0 cellpadding=4>
		<tr><td>The bordered text</tr></td>
	</table>  
  
###23. list循环中索引值

- item_index:这是一个包含当前项在循环中的步进索引的数值。
- item_has_next:来辨别当前项是否是序列的最后一项的布尔值。

code：

	<#assign seq = ["winter", "spring", "summer", "autumn"]> 
	<#list seq as x>		${x_index + 1}. ${x}<#if x_has_next>,</#if> 	</#list>

输出结果：

	1. winter, 2. spring, 3. summer, 4. autumn