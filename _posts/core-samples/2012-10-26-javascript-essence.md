---
layout: post
title : 	javascript高级特性学习笔记
description : javascript的面向对象、函数式编程、闭包、动态绑定、作用域等基础知识。
category : javascript
tags : [javascript, oop, prototype, 继承, 封装, 对象, 函数, 原型, 作用域, 闭包]
---
{% include JB/setup %}

##javascript高级特性学习笔记

###编程理念:
面向对象、函数式编程、闭包、动态绑定、作用域

####1、作用域
**概念：**
命名冲突、函数作用域

**搜索顺序：**
局域作用域->上层作用域->全局作用域

**全局对象：**

- 在Node.js对应的是global对象
- 在浏览器中对应的是window对象

**全局作用域：**

- 最外层定义的变量，如 `var global;`
- 全局对象的属性，如`$.util.pagin`
- 任何地方隐式定义的变量（未定义直接赋值），如`global="aaa"`

###2、闭包
**定义：**

当一个函数返回它内部定义的一个函数时，就产生了一个闭包。

**code：**

	var generateClosure = function(){
		var count = 0;
		var get = function(){
			count ++;
			return count;
		};
		return get;
	};
	var counter1 = generateClosure();
	var counter2 = generateClosure();
	
	console.log(counter1());//1
	console.log(counter2());//1
	console.log(counter1());//2
	console.log(counter1());//3
	console.log(counter2());//2
**结论：**

调用函数时，生成两个闭包实例，在内存中生成了相互独立的副本，它们内部引用的count变量分别属于各自的运行环境。

**用途：**

- 嵌套的回调函数
- 实现js对象私有成员，防止被外部调用时修改破坏，按非正式约定需加下划线前缀。此处模拟方式：把一个对象用闭包封装起来，只返回一个“访问器”的对象，即可实现对细节隐藏。	

###3、对象 
	
###什么是前端，前端的意义