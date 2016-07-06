!function(_) {
	function handleData(source) {
		var courses = [];
		var list = source['list'];
		for (var i = 0; i < list.length; i++) {
			var courseObj = {};
			courseObj['middlePic'] = list[i].middlePhotoUrl;
			courseObj['name'] = list[i].name;
			courseObj['count'] = list[i].learnerCount;
			courseObj['provider'] = list[i].provider;
			if (list[i].price == 0) {
				courseObj['price'] = "免费"
			} else {
				courseObj['price'] = '￥' + ' ' + list[i].price
			};
			courseObj['description'] = list[i].description;
			courseObj['cateName'] = list[i].categoryName;
			courses.push(courseObj);
		}
		courses.push(source.pagination)
		render(courses);
	};

	function render(data) {
		var coursesCards = _.$$('leftcoursesTab').getElementsByClassName('coursesCards')[0];
		var pageNav = _.$$('leftcoursesTab').getElementsByClassName('pageNav')[0];
		// pageNav.innerHTML ='';
		coursesCards.innerHTML = '';
		var html;
		for (var i = 0; i < data.length - 1; i++) {
			html = '<div class ="card"><img src =';
			html += data[i].middlePic;
			html += '><div class ="cardInfo"><p class ="coursesName">';
			html += data[i].name;
			html += '</p><p class ="coursesAuthor">';
			html += data[i].provider;
			html += '</p><p class ="coursesCount">';
			html += data[i].count;
			html += '</p><p class ="price">';
			html += data[i].price;
			html += '</p></div></div>';
			coursesCards.innerHTML += html;
		}
		var pageInfo = data[data.length - 1];
		pageNav.children[7].textContent = pageInfo.totlePageCount;
	};

	function handleHot(data) {
		var container = _.$$('rightList').getElementsByClassName('hot')[0];
		container.innerHTML = '';
		for (var i = 0; i < data.length - 10; i++) {
			var html = '<div class = "hotCase clearfix"><img src=';
			html += data[i].smallPhotoUrl;
			html += '><div class ="hotInfo"><p>';
			html += data[i].name;
			html += '</p><p>';
			html += data[i].learnerCount;
			html += '</p></div></div>';
			container.innerHTML += html;
		}
	};

	function init() {
		var head = _.$$('header').querySelector('.noteAgain');
		_.addEvent(head,'click',notShow);
		function notShow(){
			var message = _.$$('header').querySelector('.messageNote');
			if(message !== null){
				_.addClass(message,'messageDisplay');
				_.setCookie('notAgain',true);
			}
		};
		var cookie = _.getCookie();
		if(cookie.notAgain == 'true'){
			var parent =head.querySelector('.messageNote');
			if(parent){
				_.remove(_.$$('header'),parent);
			}
		}
		var url = "http://study.163.com/webDev/couresByCategory.htm";
		var urlHot = 'http://study.163.com/webDev/hotcouresByCategory.htm';
		_.getAjax(url, {
			psize: 20,
			type: 10,
			pageNo: 1
		}, handleData);
		// 开始课程卡选项点击事件
		var ul = _.$$('leftcoursesTab').getElementsByClassName('ulTab')[0];
		var pageNav = _.$$('leftcoursesTab').getElementsByClassName('pageNav')[0];

		ul.addEventListener('click', handleType);

		function handleType(event) {
			if (event.target.className == 'li-active') return;
			var list = [].slice.call(ul.children);
			for (var i = 0; i < list.length; i++) {
				_.delClass(list[i], 'li-active');
			}
			for (var b = 0; b < pageNav.children.length; b++) {
				_.delClass(pageNav.children[b], 'page-active');
			}
			_.addClass(event.target, 'li-active');
			_.getAjax(url, {
				pageNo: 1,
				psize: 20,
				type: event.target.dataset.index
			}, handleData);
		};
		// 结束课程卡选项点击事件

		// 开始页码逻辑处理
		pageNav.addEventListener('click', handlePage);

		function handlePage() {
			event = event || window.event;
			event.target = event.target || event.srcElement;
			var type = document.getElementsByClassName('li-active')[0].dataset.index;
			var pageNo;
			var psize = 20;
			if (event.target.tagName == 'SPAN') {
				if (event.target.className == 'page-active') return;
				for (var i = 0; i < pageNav.children.length; i++) {
					_.delClass(pageNav.children[i], 'page-active');
				}
				_.addClass(event.target, 'page-active');
				pageNo = event.target.textContent;
			}
			_.getAjax(url, {
				type: type,
				psize: 20,
				pageNo: pageNo
			}, handleData);
		};
		// 结束页码逻辑处理
		// 最热列表处理开始
		_.getAjax(urlHot, handleHot);
		// 最热列表处理结束

	}
	init();
}(util);
