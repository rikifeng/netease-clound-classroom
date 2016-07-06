!function(_){
	var template ='<div id="m-modal">\
		<div class="modal-align"></div>\
			<div class="modal-wrap">\
				<div class="modal-head clearfix">\
					<p>请观看下面视频：</p>\
					<img class ="close" src="./images/clsIcon.png" alt="">\
				</div>\
				<div class="modal-body">\
 				</div>\
			</div>\
	</div>';
function html2node(str){
	var container = document.createElement('div');
	container.innerHTML = str;
	return container.children[0];
}

function modalVideo(opt){
	opt = opt || {};
	this.container = this._layout.cloneNode(true);
	this.wrap = this.container.querySelector('.modal-wrap');
	this.body = this.container.querySelector('.modal-body');
	_.extend(this,opt);
	this._initEvent();
}
_.extend(modalVideo.prototype,_.emitter);
_.extend(modalVideo.prototype,{
	_layout:html2node(template),
	_initEvent:function(){
		this.container.querySelector('.close').addEventListener(
		  'click', this._onConfirm.bind(this)
		)
	},
	_onConfirm:function(){
		this.emit('confirm');
		this.hide();
		_.bug('ok');
	},
	hide:function(){
		var container = this.container;
		animateClass(this.wrap,this.animation.leave,function(){
			document.body.removeChild(container);})
	},
	show:function(content){
		if(content) this._setContent(content);
		document.body.appendChild(this.container);
		animateClass(this.wrap, this.animation.enter);
		_.bug(this.wrap.className);
	},
	_setContent:function(content){
		if(!content) return;
 		if(content.nodeType === 1){
		  this.body.innerHTML = 0;
		  this.body.appendChild(content);
		}else{
		  this.body.innerHTML = content;
		}
	}

})
window.modalVideo = modalVideo;
}(util);
