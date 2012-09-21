---
layout: post
title : 	前端基础点
description : 都是前端的基础，需要好好掌握。
category : css
tags : [css, js, html]
---
{% include JB/setup %}

###★★★★★功夫下在和工作有关的地方★★★★★
- 1、用最优的方案实现需求。在自己的已有知识结构、能力、经验上用最好的方式实现需求，在此基础上努力搜寻业界相关的解决方案比较优劣，选出最佳的方案，最终实现需求。
- 2、关心自己已做完工作，关注业界的相关新思想、新技术、新理念，把已完成的工作，用最新最优的方案予以重构，并在适当的时机在产品上得以实现。
- 3、关注自己所负责工作的未来，把产品当做自己的孩子，努力将他引向最美好的未来。努力将自己所负责的产品打造成为业界的标杆(特别是自己所负责的部分，那是自己影响圈内的事情)。

####★列出display的值 
 
可用值 值的说明

- block 象块类型元素一样显示。
- none 缺省值。向行内元素类型一样显示。
- inline-block 象行内元素一样显示，但其内容象块类型元素一样显示。
- list-item 象块类型元素一样显示，并添加样式列表标记。
- table-header-group 显示在任何表格行和行组合之前，在头部标题之后。
- table-footer-group 显示在任何表格行和行组合之后，在底部标题前。

####★清除浮动与闭合浮动的不同点
[http://www.cnblogs.com/mofish/archive/2012/05/14/2499400.html](http://www.cnblogs.com/mofish/archive/2012/05/14/2499400.html)

####★如何为元素绑定事件（就是addEvent）

	function addEvent(elm, evType, fn, useCapture) {
	  if (elm.addEventListener) {
	    elm.addEventListener(evType, fn, useCapture);//DOM2.0
	    return true;
	  }else if (elm.attachEvent) {
	    var r = elm.attachEvent('on' + evType, fn);//IE5+
	    return r;
	  }else {
	    elm['on' + evType] = fn;//DOM 0
	  }
	}


####★window.onbeforeunload 的用法 
[http://www.cnblogs.com/snandy/archive/2012/05/03/2481019.html](http://www.cnblogs.com/snandy/archive/2012/05/03/2481019.html)

####★说一下window.onerror的参数
[http://blog.csdn.net/zzxll5566/article/details/6187943](http://blog.csdn.net/zzxll5566/article/details/6187943)


####★列出IE与FF的事件对象的不同点 
[http://www.ok12.net/js/125.html](http://www.ok12.net/js/125.html)

####★如何用CSS画三角形 
(利用border属性)

####★你平时是如何调试JS代码的 
(firebug,IE开发人员工具,opera, chrome是当中最好的)

####★如何判定一个脚本是否加载成功 

	var script = document.createElement('script') ;
	var head = document.getElementsByTagName("head")[0];
	head.insertBefore(script, head.firstChild);//规避IE6下自闭合base标签BUG
	script.onload = script.onreadystatechange = function(){//先绑定事件再指定src发出请求
	    if(/loaded|complete|undefined/.test(this.readyState) && !this.once ){
	        this.once = 1;
	        this.parentNode.removeChild(this);
	    }
	}
	script.src = 'http://files.cnblogs.com/rubylouvre/html5.js'

(IE onreadystatechange事件,判定节点的readyState值是否为loaded或complete, 其他浏览器则使用onload)


####★如何判定iframe里面的资源都加载完毕
[http://www.cnblogs.com/lhgstudio/archive/2010/10/24/1859946.html](http://www.cnblogs.com/lhgstudio/archive/2010/10/24/1859946.html)

####★怎么判定一个节点是在DOM树中 
[http://www.cnblogs.com/rubylouvre/archive/2009/10/14/1583523.html](http://www.cnblogs.com/rubylouvre/archive/2009/10/14/1583523.html)


####★指出JS拖动的原理
(将元素绝对定位,一点点地改变其top,left样式来实现移动的效果,top,left可以通过鼠标获取)

####★说一下css transform2D与transform3D的区别
(一个是2*3矩阵,一个是4*4矩阵,transform3D支持GPU硬件加速,更加流畅,建议用transform3D模拟transform2D)


####★指出{}+[]与[]+{}的值,为什么 
(第一个为0,因为{}放在语句在前面,JS引擎认为它只是一个块,不是空对象,相当于+[] ===> +"" ==> 0, 第二个是"[object Object]",两者取toString(),然后相加)


####★说一下浏览器资源加载的情况,IE与其他浏览器各版本的不同之外
[http://www.otakustay.com/browser-strategy-loading-external-resource/](http://www.otakustay.com/browser-strategy-loading-external-resource/)

####★说一下最近非常流行模块加载,大概是怎么实现的,有什么好处
[http://www.cnblogs.com/muguaworld/archive/2011/11/27/2265356.html](http://www.cnblogs.com/muguaworld/archive/2011/11/27/2265356.html)

####★高性能JavaScript模板引擎原理解析
[http://cdc.tencent.com/?p=5723](http://cdc.tencent.com/?p=5723)

###1.javascript对象的几种创建方式


**1）工厂方式**

	//定义
	
	function createCar() {
	
		var oCar = new Object();
		
		oCar.color = "red";
		
		oCar.doors = 4;
		
		oCar.showColor = function() {
		
			alert(this.color);
		
		}
		
		return oCar;
	
	}
	
	//调用
	
	var ocar1 = createCar();
	
	var ocar2 = createCar();
	
	ocar1.color = "black";
	
	ocar1.showColor();
	
	ocar2.showColor();
	
	//修改createCar()函数，给它传递各个属性的默认值：
	
	
	function createCar(sColor, iDoors, iMpg) {
	
		var oTempCar = new Object;
		
		oTempCar.color = sColor;
		
		oTempCar.doors = iDoors;
		
		oTempCar.mpg = iMpg;
		
		oTempCar.showColor = function () {
		
			alert(this.color);
		
		};
		
		return oTempCar;
	
	}
	
	var oCar1 = createCar("red", 4, 23);
	
	var oCar2 = createCar("blue", 3, 25);
	
	oCar1.showColor(); //outputs "red"
	
	oCar2.showColor(); //outputs "blue"
	
	
	//在工厂函数外定义对象的方法，然后通过属性指向该方法，
	
	//从而避免每次调用函数createCar()，都要创建新函数showColor()。
	
	
	function showColor(){
	
		alert(this.color);
	
	}
	
	function createCar(sColor, iDoors, iMpg){
	
		var oTempCar = new Object;
		
		oTempCar.color = sColor;
		
		oTempCar.doors = iDoors;
		
		oTempCar.mpg = iMpg;
		
		oTempCar.showColor = showColor;
		
		return oTempCar;
	
	}

**2）构造函数方式**

在构造函数内部无创建对象，而是使用this关键字。使用new运算符调用构造函数时，在执行第一行代码前先创建一个对象，只有用this才能访问该对象。然后可以直
接赋予this属性，默认情况下是构造函数的返回值（不必明确使用return运算符）。

	function Car(sColor, iDoors, iMpg) {
	
		this.color = sColor;
		
		this.doors = iDoors;
		
		this.mpg = iMpg;
		
		this.showColor = function() {
		
			alert(this.color);
		
		};
	
	}
	
	var oCar1 = new Car("red", 4, 23);
	
	var oCar2 = new Car("blue", 3, 25);

**3）原型方式**

	//定义
	
	function Car() {
	
	}
	
	Car.prototype.color = "red";
	
	Car.prototype.doors = 4;
	
	Car.prototype.drivers = new Array("Tom", "Jerry");
	
	Car.prototype.showColor = function() {
	
		alert(this.color);
	
	}
	
	//调用：
	
	var car1 = new Car();
	
	var car2 = new Car();
	
	car1.showColor();
	
	car2.showColor();
	
	alert(car1.drivers);
	
	car1.drivers.push("stephen");
	
	alert(car1.drivers); //结果：Tom,Jerry,stephen
	
	alert(car2.drivers); //结果：Tom,Jerry,stephen
	
	
	//可以用json方式简化prototype的定义:
	
	Car.prototype = {
	
	color: "red",
	
	doors: 4,
	
	drivers: ["Tom", "Jerry",'safdad'],
	
	showColor: function() {
	
		alert(this.color);
	
	}
	
	}

**4）混合的构造函数/原型方式**

用构造函数定义对象的所有非函数属性，用原型方式定义对象的函数属性(方法)。

	//定义
	
	function Car(color,doors) {
	
		this.color=color;
		
		this.doors=doors;
		
		this.drivers=new Array("Tom","Jerry");
	
	}
	
	Car.prototype.showColor=function(){
	
		alert(this.color);
	
	}
	
	
	//调用：
	
	var car1=new Car('red',4);
	
	var car2=new Car('blue',4);
	
	
	car1.showColor();
	
	car2.showColor();
	
	
	alert(car1.drivers);
	
	car1.drivers.push("stephen");
	
	alert(car1.drivers); //结果：Tom,Jerry,stephen
	
	alert(car2.drivers); //结果：Tom,Jerry
	
	alert(car1 instanceof Car);

**5）动态原型方法**

	function Car() {
	
		this.color = "red";
		
		this.doors = 4;
		
		this.drivers = new Array("Tom", "Jerry");
		
		if (typeof Car._initialized == "undefined") {
		
		Car.prototype.showColor = function() {
		
			alert(this.color);
	
		}
		
		//…………
	
	}
	
	//最后定义
	
	Car._initialized = true;
	
	}

**6）混合工厂方式**

目的是创建假构造函数，只返回另一种对象的新实例。

	function Car() {
		
		var oTempCar = new Object();
		
		oTempCar.color="red";
		
		oTempCar.doors=4;
		
		oTempCar.mpg=23;
		
		oTempCar.showColor = function() {
		
			alert(this.color);
		
		}
		
		return oTempCar;
		
	}
	
	//与经典方式不同，这种方式使用new运算符，使它看起来像真正的构造函数：
	
	var oCar = new Car();

由于在Car()构造函数内部调用了new运算符，所以将忽略第二个new运算符（位于构造函数之外）。在构造函数内部创建的对象被传递回变量var。这种方式在对象
方法的内部管理方面与经典方式有着相同的问题。强烈建议：除非万不得已，还是避免使用这种方式。


总结：（采用哪种方式)

目前使用最广泛的是混合的构造函数/原型方式。此外，动态原型方法也很流行，在功能上与构造函数/原型方式等价。可以采用这两种方式中的任何一种。不过不要单独使用经
典的构造函数或原型方式，因为这样会给代码引入问题。


###2. 盒模型——外边距、内边距和边框之间的关系，IE 8以下版本的浏览器中的盒模型有什么不同。
  
###3.块级元素与行内元素——怎么用CSS控制它们、它们怎样影响周围的元素以及你觉得应该如何定义它们的样式。


###4.浮动元素——怎么使用它们、它们有什么问题以及怎么解决这些问题。


###5.HTML与XHTML——二者有什么区别，你觉得应该使用哪一个并说出理由。


###6.JSON——它是什么、为什么应该使用它、到底该怎么使用它，说出实现细节来。

JSON(JavaScript Object Notation) 是一种轻量级的数据交换格式。易于人阅读和编写。同时也易于机器解析和生成。


JSON建构于两种结构：

“名称/值”对的集合（A collection of name/value
pairs）。不同的语言中，它被理解为对象（object），纪录（record），结构（struct），字典（dictionary），哈希表（hash
table），有键列表（keyed list），或者关联数组 （associative array）。

值的有序列表（An ordered list of values）。在大部分语言中，它被理解为数组（array）。


###7.页面布局：自适应流布局
css3盒布局，它允许宽度自适应，改变元素显示顺序，优先加载重要区域。
