/*
* 分页组件
* author :heiniuhaha@gmail.com
* usage : 魔乐web项目统一分页组件
* date : 2012-11-01
*/
var pagination = {
	options : {}, 
	conf : function(){
		var self = this;
		var defaults = {
			obj : $("#J_Pagination"),//初始化的对象
			sumCount : 200,//总条数
			onePageCount : 20,//每页显示数
			curPage : 1,//当前页码
			url : '?',//分页链接
			intervalCount : 5,//以5个为一个分页排	
			prevText : "<",
			nextText : ">",
			prevIntervalText : "&lt;&lt;",
			nextIntervalText : "&gt;&gt;",
			clickCallback : function($clickObj){},//点击分页按钮后的回调函数
			
			isAjax : false,//是否ajax方式跳转，默认非ajax方式
			ajaxUrl : function($clickObj){},//ajax请求url，包含参数
			ajaxCallback : function($clickObj, $ajaxData){}//ajax获取数据成功后json数据处理的回调函数
		}
		var config = $.extend(true, defaults, self.options);
		return config;
	},
	
	//获取总页数
	getPageCount : function(){
		var self = this;
		if(self.conf().sumCount > self.conf().onePageCount){//总条数>一页显示数
			return Math.ceil(self.conf().sumCount/self.conf().onePageCount);
		}else if(self.conf().sumCount > 0){//0<总条数<=一页显示数
			return 1;
		}else{//总条数==0
			return 0;
		}
	},
	//根据当前的分页值，生成分页列表
	getPageList : function(){
		var self = this;
		
		console.log(self.options.curPage)
		
		if(self.getPageCount() > 0){
			var mainHtml = "",
				prevHtml = "",
				nextHtml = "",
				prevIntervalHtml = "",
				nextIntervalHtml = "",
				pageListIndex,
				curPage = parseInt(self.conf().curPage),
				hrefParam = self.conf().isAjax ? "data-href" : "href";
			
			//上一页页码
			var prevIndex = (curPage - 2)*self.conf().onePageCount + 1;
			
			//下一页页码
			var nextIndex = curPage*self.conf().onePageCount + 1;
			
			//最大排数
			var maxIntervalCount = Math.ceil(self.getPageCount()/self.conf().intervalCount);
			
			//当前是第几排
			var curPageInterval = Math.ceil(curPage/self.conf().intervalCount);
			//console.log(curPageInterval);
			
			//当前排分页起始页码
			var curPageIntervalBeginIndex = (curPageInterval - 1)*self.conf().intervalCount + 1;
			
			//当前排分页结束页码
			var curPageIntervalEndIndex = (curPageInterval <= maxIntervalCount && self.getPageCount() >= self.conf().intervalCount) ? curPageInterval*self.conf().intervalCount : self.getPageCount();
			
			
			//上一排起始页码 上一排起始页码的索引值
			var prevIntervalPageNum = ((curPageInterval - 2)*self.conf().intervalCount) + 1;
			var prevIntervalIndex = ((curPageInterval - 2)*self.conf().intervalCount)*self.conf().onePageCount + 1;
			
			//下一排起始页码 下一排起始页码的索引值
			var nextIntervalPageNum = curPageInterval*self.conf().intervalCount + 1;
			var nextIntervalIndex = (curPageInterval*self.conf().intervalCount)*self.conf().onePageCount + 1;
			
			console.log("curPage:" + curPage);
			console.log("总页数self.getPageCount()：" + self.getPageCount())
			console.log("当前第几排curPageInterval:" + curPageInterval);
			console.log("最大排数maxIntervalCount：" + maxIntervalCount);
			console.log("当前排结束页码curPageIntervalEndIndex:" + curPageIntervalEndIndex)
			
			//生成主体分页列表			
			for(var i = curPageIntervalBeginIndex; i <= curPageIntervalEndIndex; i++){
				if(i != curPage){
					pageListIndex = parseInt((i-1)*self.conf().onePageCount) + 1;
					mainHtml += '<a ' + hrefParam + '="' + self.conf().url + pageListIndex + '#p=' + i + '">' +  i + '</a>';
				}else{
					mainHtml += '<span class="current">' + i + '</span>';
				}
			}
			
			
			//生成上一页按钮
			if(curPage > 1){//不在第一页
				prevHtml += '<a class="prev" ' + hrefParam + '="' + self.conf().url + prevIndex + '#p=' + (curPage -1) + '">' + self.conf().prevText + '</a>';
			}else{
				prevHtml += '<span class="prev">' + self.conf().prevText + '</span>';
			}
			
			//生成下一页按钮
			if(self.getPageCount() > curPageIntervalEndIndex){//总页数比当前排的结束页码大
				nextHtml += '<a class="next" ' + hrefParam + '="' + self.conf().url + nextIndex + '#p=' + (curPage + 1) + '">' + self.conf().nextText + '</a>';
			}else{
				prevHtml += '<span class="next">' + self.conf().nextText + '</span>';
			}
			
			//生成上一排按钮，显示前一排分页
			if(curPageInterval <= 1){//分页排在第一排不显示前一排
				prevIntervalHtml += '<span class="interval">&lt;&lt;</span>';
			}else{
				prevIntervalHtml += '<a ' + hrefParam + '="' + self.conf().url + prevIntervalIndex + '#p=' + prevIntervalPageNum + '">&lt;&lt;</a>';	
			}
		
			//生成下一排按钮，显示后一排分页 //分页排在最后一排不显示后一排
			if(maxIntervalCount <= curPageInterval){
				nextIntervalHtml += '<span class="interval">&gt;&gt;</span>';
			}else{
				nextIntervalHtml += '<a ' + hrefParam + '="' + self.conf().url + nextIntervalIndex + '#p=' + nextIntervalPageNum + '">&gt;&gt;</a>';
			}
			
			//显示完整分页列表
			self.conf().obj.html(prevIntervalHtml + prevHtml + mainHtml + nextHtml + nextIntervalHtml);
		
		}else if(self.getPageCount() == 1){//只有一页
			self.conf().obj.html('<span class="current">1</span>');
		}else{
			self.conf().obj.html('<p class="no-data">亲，还没有信息哦！</p>');
		}
		
	},
	//如果是ajax方式分页，处理方式
	ajaxOper : function(url, $clickObj){
		var conf = this.conf();
		$.getJSON(url, function($ajaxData) {
			/* 
			 * 点击url后的回调函数
			 * param $clickObj ： 鼠标点击的对象
			 * param data ：ajax请求后返回的数据对象
			 */
			conf.ajaxCallback($clickObj, $ajaxData);
		});
	},
	//跳转到第几页
	seekTo : function($clickObj){
		

	},
	init : function(){
		var self = this;
		var conf = self.conf();
		console.log(self.options.curPage)
		//生成分页列表
		self.getPageList();
		
		//点击按钮处理方式
		conf.obj.find("a").live("click", function(){
			var $this = $(this);
			//点击后的通用回调函数
			conf.clickCallback($this);	
			self.options.curPage = $this.data("href").split("=")[1];
			console.log(self.options.curPage)
			self.getPageList();
			
			//是ajax方式，执行ajax方式调用	
			if(conf.isAjax){
				//self.ajaxOper(conf.ajaxUrl($this), $this);
				$.getJSON(conf.ajaxUrl($this), function($ajaxData) {
					/* 
					 * 点击url后的回调函数
					 * param $clickObj ： 鼠标点击的对象
					 * param data ：ajax请求后返回的数据对象
					 */
					conf.ajaxCallback($this, $ajaxData);
				});				
			}
		});
	}
}