/**
 *      -------------------
 *      |     |     |     |  <- 只有三栏是常驻的
 * -------------------------------
 * |    |     |     |     |      |
 * |    |     |     |     |      |
 * |    |  1  |  2  |  3  |      |
 * |    |     |     |     |      |
 * |    |     |     |     |      |
 * |    |     |     |     |      |
 * -------------------------------
 *      |     |     |     |
 *      -------------------
 */

//！function(){}();
//;(function(){})();
;(function(_){

  // 将HTML转换为节点
  function html2node(str){
    var container = document.createElement('div');
    container.innerHTML = str;
    return container.children[0];
  }


  var template =
  '<div class="m-slider" >\
    <div class="slide"></div>\
    <div class="slide"></div>\
    <div class="slide"></div>\
  </div>';



  function Slider( opt ){

    _.extend(this, opt);

    // 容器节点 以及 样式设置
    this.container = this.container || document.body;
    this.container.style.overflow = 'hidden';


    // 组件节点,返回容器节点的第一个子节点元素，slider
    this.slider = this._layout.cloneNode(true);
    //selector的名字為.slide的HTMLCollection,linkArray轉為Array
    this.slides = [].slice.call(this.slider.querySelectorAll('.slide'));

    // 拖拽相关
    this.offsetWidth = this.container.offsetWidth;
    //breakPoint =320
    this.breakPoint = this.offsetWidth / 4;

    //pageNum = 3
    this.pageNum = this.images.length;

    // 内部数据结构
    this.slideIndex = 1;
    this.pageIndex = this.pageIndex || 0;
    this.offsetAll = this.pageIndex;


    // this.pageNum 必须传入
    // 初始化动作
    this.container.appendChild(this.slider);
    // _.bug(this.slider);

  }

  _.extend( Slider.prototype, _.emitter );

  _.extend( Slider.prototype, {

    _layout: html2node(template),

    // 直接跳转到指定页
    // pageIndex 2
    nav: function( pageIndex ){

      this.pageIndex = pageIndex
      this.slideIndex = typeof this.slideIndex === 'number'? this.slideIndex: (pageIndex+1) % 3;
      this.offsetAll = pageIndex;

      this.slider.style.transitionDuration = '0s';

      this._calcSlide();

    },
    //下一页
    next: function(){
      this._step(1);
    },
    // 上一页
    prev: function(){
      this._step(-1);
    },
    // 单步移动
    _step: function(offset){

      this.offsetAll += offset;
      this.pageIndex += offset;
      this.slideIndex +=offset;
      this.slider.style.transitionDuration = '.5s';

      this._calcSlide();

    },
    // 计算Slide
    // 每个slide的left = (offsetAll + offset(1, -1)) * 100%;
    // 外层容器 (.m-slider) 的偏移 = offsetAll * 宽度
    _calcSlide: function(){

      //
      var slideIndex = this.slideIndex= this._normIndex(this.slideIndex, 3);
      var pageIndex = this.pageIndex= this._normIndex(this.pageIndex, this.pageNum);
      var offsetAll = this.offsetAll;
      var pageNum = this.pageNum;

      var prevSlideIndex = this._normIndex( slideIndex - 1, 3 );
      var nextSlideIndex = this._normIndex( slideIndex + 1, 3);

      var slides = this.slides;

      // 三个slide的偏移
      slides[slideIndex].style.left = (offsetAll) * 100 + '%'
      slides[prevSlideIndex].style.left = (offsetAll-1) * 100 + '%'
      slides[nextSlideIndex].style.left = (offsetAll+1) * 100 + '%'

      // 容器偏移
      this.slider.style.transform = 'translateX('+ (-offsetAll * 100)+'%) translateZ(0)'


      // 当前slide 添加 'z-active'的className
      slides.forEach(function(node){_.delClass(node, 'z-active') })
      _.addClass(slides[slideIndex], 'z-active');

      this._onNav(this.pageIndex, this.slideIndex);


    },
    // 标准化下标
    _normIndex: function(index, len){
      return (len + index) % len
    },

    // 跳转时完成的逻辑， 这里是设置图片的url
    _onNav: function(pageIndex, slideIndex){

      var slides = this.slides;

      for(var i =-1; i<= 1; i++){
        var index = (slideIndex + i+3)%3;
        var img = slides[index].querySelector('img')
        if(!img){
          img = document.createElement('img');
          slides[index].appendChild(img);
        }
        img.src = './images/jpg/banner' + ( this._normIndex(pageIndex + i, this.pageNum)+1 ) + '.jpg';
      }

      this.emit('nav', {
        pageIndex: pageIndex,
        slideIndex: slideIndex
      })

    }
  })


  window.Slider = Slider;

})(util);
