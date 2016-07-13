!function(_,md5){
	var template = '<div id="m-login">\
										<div class="login-align"></div>\
										<div class="login">\
											<div class="login-head clearfix">\
												<h3>登录网易云课堂</h3>\
												<img class ="cls" src="./images/clsIcon.png" alt="">\
											</div>\
											<div class="login-body">\
												<p><label for="username">帐号</label><input\ type="text" id ="username"></p>\
												<p><label for="passward">密码</label><input\ type="password" id ="psw"></p>\
												<div id ="loginBtn" class ="a">登录</div>\
											</div>\
										</div>\
									</div>';
	function html2node(str){
		var container = document.createElement('div');
		container.innerHTML = str;
		return container.children[0];
	};
	function Follow(opt){
		_.extend(this,opt);
		this.container = opt.container;
		this.login = this._layout.cloneNode(true);
		this.wrap=this.login.querySelector('.login');
		this.clsBtn = this.login.querySelector('.cls');
		this.loginBtn = this.login.querySelector('#loginBtn');
		// this._init();
		this._initEvent();
	};
	_.extend(Follow.prototype,{
		_layout:html2node(template),
		isLogin:function(){
			var cookie = _.getCookie();
 		if(cookie.loginSuc === '1'){
				this.focusOn();
			}else{
				this.showLog();
			}
		},
		focusOn:function(){
 			var url ='http://study.163.com/webDev/attention.htm';
 			var that = this;
 			_.getAjax(url,function(data){
				if(data === 1){
					_.setCookie('followSuc',1);
					that._close.bind(this);
					var fol = _.$$('fol');
					fol.innerHTML = '';
					fol.className = "fixClass";
					var html = '<ul><li>关注</li><li>取消</li></ul>'
					fol.innerHTML = html;
					fol.dataset.name = '1';
				}
			});
		},
		showLog:function(){
			this.container.appendChild(this.login);
		},
		_initEvent:function(){
			var cls = this.login.querySelector('.cls');
			_.addEvent(cls,'click',this._close.bind(this));
			_.addEvent(this.loginBtn,'click',this._checklog.bind(this));
			_.addEvent(this.wrap.querySelector('input'),'focus',this._rework.bind(this));
		},
		_close:function(){
			this.emit('close');
		},
		_rework:function(){
 			this.emit('focus');
		},
		_checklog:function(){
			var url ='http://study.163.com/webDev/login.htm';
 			var username = md5(this.login.querySelector('#username').value);
			var psw = md5(this.login.querySelector('#psw').value);
 			_.getAjax(url,{userName:username,password:psw},this._checkHandle.bind(this));
 		},
 		_checkHandle:function(data){
 				if(data === 1){
 					_.setCookie('loginSuc',1);
 						_.remove(document.body,document.getElementById('m-login'));
 						this.focusOn.bind(this);
 				}else{
 					var span = document.createElement('span');
 					var head = _.$$('m-login').querySelector('.login-head');
					if (head.lastChild.tagName !== 'SPAN') {
						span.textContent = '请输入正确的用户名和密码！';
						span.className = 'spanSt';
						head.appendChild(span);
					}
 				}
 		}
	});
	_.extend(Follow.prototype,_.emitter);
	window.Follow = Follow;
}(util,md5);
