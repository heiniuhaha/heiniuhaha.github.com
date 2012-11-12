function loadImg(src,callback){
	var img = new Image();
	var loaded = false;
	img.onload = function(){
	  loaded = true;
	};
	img.src    = src;//先onload再设置src，防止ie缓存不执行onload
	setTimeout(function(){
	  if(loaded){
	      callback && callback.call(img);
	  }else{
	      setTimeout(arguments.callee,100);//未加载完成就继续调用
	  }
	},0)
};
           
loadImg('http://www.google.cn/intl/zh-CN/images/logo_cn.gif',function(){
  document.body.appendChild(this);
  alert([this.width,this.height]);
});
//有次发现载入图片如果不appendChild放在页面里 ie6不发起请求。。。。很奇怪