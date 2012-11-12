/*
new一个Image对象，设置了src属性过后，不断的检查需要载入的图片的宽和高，
如果载入图片成功的话，宽和高都是不为0的数值，这个时候停止Interval ，并且执行onLoaded。
*/
function EnhancedImage(src,onLoaded){
    var self = this;
    this.src = src;
    this.width = 0;
    this.height = 0;
    this.onLoaded = onLoaded;
    this.loaded = false;
    this.image = null;
    
    this.load = function(){
        if(this.loaded)
            return;
        this.image = new Image();
        this.image.src = this.src;
        function loadImage(){
            if(self.width != 0 && self.height != 0){
                clearInterval(interval);
                self.loaded = true;
                self.onLoaded(self);//将实例传入回调函数
            }
            self.width = self.image.width;//是number类型
            self.height = self.image.height;
        }
        var interval = setInterval(loadImage,100);
    }
}

var img = new EnhancedImage("http://www.google.cn/intl/zh-CN/images/logo_cn.gif",onImageLoad);
function onImageLoad(image){
    document.body.appendChild(image.image);
    alert("image loaded and the size is " + image.width + "*" + image.height);
}
//向server发起两次图片请求??