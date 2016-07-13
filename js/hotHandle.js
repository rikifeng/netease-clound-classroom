!function(_){
	var hotTemp = '<div class="hotCase clearfix">\
									 <img src="" alt="">\
										<div class="hotInfo">\
											<p></p>\
											<p></p>\
										</div>\
							 	</div>';
	function html2node(str){
		var container = document.createElement('div');
		container.innerHTML = str;
		return container.children[0];
	}
	function hotList(opt){
		this.container = opt.container;
		this.hotUrl ='http://study.163.com/webDev/hotcouresByCategory.htm';
 		this.hotSource = [];
		this.hotShow = new Array(10);
		this.index = 10;
		this.init();
	}
	_.extend(hotList.prototype,{
		init:function(){
			_.getAjax(this.hotUrl,this._hotHandle.bind(this));
			var that = this;
			setInterval(
				this._hotShow.bind(this)
			,5000)
		},
		_hotShow:function(){
			var index = this.index;
			if(index < this.hotSource.length && index >=10){
				this.hotShow.shift();
				this.hotShow.push(this.hotSource[index ++]);
				this.index = index;
			}
			if(index >= this.hotSource.length){
				for(var i = 0;i<this.hotShow.length;i++){
					this.hotShow[i] = this.hotSource[i];
				}
				this.index = 10;
 			}
			this._render();
		},

		_hotHandle:function(data){
			for(var i = 0,l = data.length;i<l;i++){
				var hotScase = {};
				hotScase.name = data[i].name;
				hotScase.smallPhotoUrl = data[i].smallPhotoUrl;
				hotScase.learnerCount = data[i].learnerCount;
				this.hotSource.push(hotScase);
				if(i<10){this.hotShow[i] =this.hotSource[i];}
			}
 			this._render();
		},
		_render:function(){
			this.container.innerHTML = '';
			for(var i = 0,l = this.hotShow.length;i<l;i++){
				this.container.appendChild(html2node(hotTemp).cloneNode(true));
				this.container.children[i].children[1].firstElementChild.textContent = this.hotShow[i].name;
				this.container.children[i].children[1].lastElementChild.textContent = this.hotShow[i].learnerCount;
				this.container.children[i].children[0].src = this.hotShow[i].smallPhotoUrl;
			}
		}
	});
	_.extend(hotList.prototype,_.emitter);
	window.hotList = hotList;
}(util)
