!function (_){
	var courseTemp ='<div class="card">\
										<img  alt="">\
										<div class="cardInfo">\
											<p class ="coursesName"></p>\
											<p class ="coursesAuthor"></p>\
											<p class ="cousrsCount"></p>\
											<p class ="price"></p>\
										</div>\
									</div>';
		var pageTemp = '<div class = "pageNav">\
											<i class ="pageflip prev" data-index = "1"></i>\
											<span></span>\
											<span></span>\
											<span></span>\
											<span></span>\
											<span></span>\
											<b>...</b>\
											<span></span>\
											<i class ="pageflip next" data-index = "2"></i>\
										<div>';
	function html2node (str){
		var container = document.createElement('div');
		container.innerHTML = str;
 		return container.children[0];
	}
	function Course(opt){
		this.container = opt.container;
		this.courseUrl = "http://study.163.com/webDev/couresByCategory.htm";
		this.options = opt.optionJ;
		this.ul = this.container.previousElementSibling;
		this.li = [].slice.call(this.ul.querySelectorAll('li'));
		this.pageCon = this.container.nextElementSibling;
		this.init();
		this.initEvent()
	}
	_.extend(Course.prototype,{
		_layoutPage: html2node(pageTemp).cloneNode(true),
		init:function(){
			this.pageCon.appendChild(this._layoutPage);
			_.getAjax(this.courseUrl, this.options,this._render.bind(this));
		},
		_render:function(data){
			this.container.innerHTML = '';
			var course = data.list;
			for(var i = 0,l=course.length;i<l;i++){
				this._layout = html2node(courseTemp).cloneNode(true);
				this._layout.children[0].src = course[i].middlePhotoUrl;
				this._layout.children[1].children[0].textContent =course[i].name;
				this._layout.children[1].children[1].textContent =course[i].learnerCount;
				this._layout.children[1].children[2].textContent =course[i].provider;
				this._layout.children[1].children[3].textContent =course[i].price === 0?'免费':'￥ ' + course[i].price;
				this.container.appendChild(this._layout);
			}
			this.pageHandle(data.pagination);
		},
		pageHandle:function(data){
			this.pageCon.innerHTML = '';
			this.pageCon.appendChild(this._layoutPage);
 			var span = this.pageCon.querySelectorAll('span');
			var pageNo = parseInt(this.options.pageNo);
	 			if(pageNo <= 2){
					span[0].textContent = pageNo;
					for(var i =1;i<span.length-1;i++){
						_.delClass(span[i],'page-active');
						span[i].textContent = ++pageNo;
					}
					_.addClass(span[0],'page-active');
				}else{
				if(pageNo === data.totlePageCount){
					for(var i=span.length-1;i>=0;i--){
						_.delClass(span[i],'page-active');
						span[i].textContent = pageNo--;
					}
					_.addClass(span[5],'page-active');
				}else{
					for(var i= 0,l=span.length;i<l;i++){
						_.delClass(span[i],'page-active');
					}
					span[0].textContent = pageNo -2;
					span[1].textContent = pageNo -1;
 					span[2].textContent = pageNo;
	 				_.addClass(span[2],'page-active');
					span[3].textContent = pageNo +1;
	 				span[4].textContent = pageNo +2;
 					}
 				}
			span[5].textContent = data.totlePageCount;
		},
		initEvent:function(){
			for(var i =0,l =this.li.length;i<l;i++){
				_.addEvent(this.li[i],'click',this._typeHandle.bind(this));
			};
			_.addEvent(this.pageCon.firstElementChild,'click',this.pageEvent.bind(this))
		},
		pageEvent:function(ev){
			var curentPage = this.pageCon.getElementsByClassName('page-active')[0];
			if(ev.target.tagName === 'SPAN'){
				this.options.pageNo = parseInt(ev.target.textContent);
				_.getAjax(this.courseUrl,this.options,this._render.bind(this));
			}
			if(ev.target.dataset.index == '1'){
				if(curentPage.textContent === '1')return;
				this.options.pageNo -= 1;
				_.getAjax(this.courseUrl,this.options,this._render.bind(this))
			}
			if(ev.target.dataset.index == '2'){
				if(curentPage.textContent === '30')return;
				this.options.pageNo += 1;
				_.getAjax(this.courseUrl,this.options,this._render.bind(this))
			}
		},
		_page:function(ev){

			if(ev.target.className === 'page-active')return;
			 this.options.pageNo = ev.target.textContent;
			 this.options.type = parseInt(this.ul.getElementsByClassName('li-active')[0].dataset.index);
				_.getAjax(this.courseUrl,this.options,this._render.bind(this));
		},
		_typeHandle:function(event){
			if(event.target.className === 'li-active')return;
			event.target.parentNode.children[0].className ='';
			event.target.parentNode.children[1].className ='';
			event.target.className = 'li-active';
			this.options.type = parseInt(event.target.dataset.index);
			this.options.pageNo = 1;
			_.getAjax(this.courseUrl,this.options,this._render.bind(this));
		}
	});
	_.extend(Course.prototype,_.emitter);
	window.Course = Course;
}(util);
