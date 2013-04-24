$('.goods').bind("mouseover mouseout",function(event){
		var $this = $(this); 
		if(event.type == "mouseover"){
			$this.addClass('cur-goods');
			if($this.find(".ilike-m")[0]){
				$this.find(".ilike-m").show();
			}
			if($this.find(".ilike-del")[0]){
				$this.find(".ilike-del").show();
			}
			if($this.find(".ilike-topic")[0]){
				$this.find(".ilike-topic").show();
			}
		}else{
			$this.removeClass('cur-goods');
			if($this.find(".ilike-m")[0]){
				$this.find(".ilike-m").hide();
			}
			if($this.find(".ilike-del")[0]){
				$this.find(".ilike-del").hide();
			}
			if($this.find(".ilike-topic")[0]){
				$this.find(".ilike-topic").hide();
			}
		}
	});

也可考虑使用$.hover(fn1, fn2)