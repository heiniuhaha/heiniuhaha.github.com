var pagination = {
	options : {}, 
	conf : function(){
		var self = this;
		var defaults = {
			obj : $("#J_Pagination"),
			sumCount : 200,//总条数
			onePageCount : 20,//每页显示数
			curPage : 1,//当前页码
			url : '?',//分页链接
			intervalCount : 5,//以5个为一个分页排	
			prevText : "<",
			nextText : ">",
			prevIntervalText : "&lt;&lt;",
			nextIntervalText : "&gt;&gt;",
			clickCallback : function(){}//点击url后的回调函数
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
		if(self.getPageCount() > 0){
			var mainHtml = "",
				prevHtml = "",
				nextHtml = "",
				prevIntervalHtml = "",
				nextIntervalHtml = "",
				pageListIndex,
				curPage = parseInt(self.conf().curPage);
			
			
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
			var curPageIntervalEndIndex = (curPageInterval <= maxIntervalCount) ? curPageInterval*self.conf().intervalCount : self.conf().sumCount;
			
			
			//上一排起始页码 上一排起始页码的索引值
			var prevIntervalPageNum = ((curPageInterval - 2)*self.conf().intervalCount) + 1;
			var prevIntervalIndex = ((curPageInterval - 2)*self.conf().intervalCount)*self.conf().onePageCount + 1;
			
			//下一排起始页码 下一排起始页码的索引值
			var nextIntervalPageNum = curPageInterval*self.conf().intervalCount + 1;
			var nextIntervalIndex = (curPageInterval*self.conf().intervalCount)*self.conf().onePageCount + 1;
			/*
			console.log("总页数self.getPageCount()：" + self.getPageCount())
			console.log("当前第几排curPageInterval:" + curPageInterval);
			console.log("最大排数maxIntervalCount：" + maxIntervalCount);
			console.log("当前排结束页码curPageIntervalEndIndex:" + curPageIntervalEndIndex)
			*/
			//生成主体分页列表			
			for(var i = curPageIntervalBeginIndex; i <= curPageIntervalEndIndex; i++){
				if(i != curPage){
					pageListIndex = parseInt((i-1)*self.conf().onePageCount) + 1;
					mainHtml += '<a href="' + self.conf().url + "index=" + pageListIndex + '#' + i + '">' +  i + '</a>';
				}else{
					mainHtml += '<span class="current">' + i + '</span>';
				}
			}
			
			
			//生成上一页按钮
			if(curPage > 1){//不在第一页
				prevHtml += '<a class="prev" href="' + self.conf().url + "index=" + prevIndex + '#' + (curPage -1) + '">' + self.conf().prevText + '</a>';
			}else{
				prevHtml += '<span class="prev">' + self.conf().prevText + '</span>';
			}
			
			//生成下一页按钮
			if(self.getPageCount() > curPageIntervalEndIndex){//总页数比当前排的结束页码大
				nextHtml += '<a class="next" href="' + self.conf().url + "index=" + nextIndex + '#' + (curPage + 1) + '">' + self.conf().nextText + '</a>';
			}else{
				prevHtml += '<span class="next">' + self.conf().nextText + '</span>';
			}
			
			//生成上一排按钮，显示前一排分页
			if(curPageInterval <= 1){//分页排在第一排不显示前一排
				prevIntervalHtml += '<span class="interval">&lt;&lt;</span>';
			}else{
				prevIntervalHtml += '<a href="' + self.conf().url + "index=" + prevIntervalIndex + '#' + prevIntervalPageNum + '">&lt;&lt;</a>';	
			}
		
			//生成下一排按钮，显示后一排分页 //分页排在最后一排不显示后一排
			if(maxIntervalCount <= curPageInterval){
				nextIntervalHtml += '<span class="interval">&gt;&gt;</span>';
			}else{
				nextIntervalHtml += '<a href="' + self.conf().url + "index=" + nextIntervalIndex + '#' + nextIntervalPageNum + '">&gt;&gt;</a>';
			}
			
			//显示完整分页列表
			self.conf().obj.html(prevIntervalHtml + prevHtml + mainHtml + nextHtml + nextIntervalHtml);
		
		}else if(self.getPageCount() == 1){//只有一页
			self.conf().obj.html('<span class="current">1</span>');
		}else{
			self.conf().obj.html('<p class="no-data">亲，还没有信息哦！</p>');
		}
		self.conf().clickCallback(curPage);//(当前页码)
	},
	init : function(){
		this.getPageList();
	}
}

pagination.options = {
	obj : $("#J_Pagination"),
	sumCount : 285,
	onePageCount : 10,
	curPage : window.location.hash ? (window.location.hash).substring(1) : 1
}
pagination.init();
//console.log("sumCount : 285, onePageCount : 30,intervalCount:5")