var util = (function(){

  return {
    extend: function(o1, o2){
      for(var i in o2) if (o1[i] == undefined ) {
        o1[i] = o2[i]
      }
    },
    $$:function(id){
      return document.getElementById(id)
    },
    setCookie:function(name,value,expires,path,domain,secure){
      var cookie =encodeURIComponent(name).trim() + '=' + encodeURIComponent(value).trim();
      if(expires)
        cookie += '; expires=' +expires.toGMTString();
      if(path)
        cookie += '; path=' +path;
      if(domain)
        cookie += '; domain=' +domain;
      if(secure)
        cookie += '; secure=' +secure;
      document.cookie = cookie;
    },
    getCookie:function(){
      var cookie ={};
      var all = document.cookie;
      if(all ==='') return cookie;
      var list =all.split(';');
      for(var i=0,l=list.length;i<l;i++){
        var p =list[i].indexOf('=');
        var name = list[i].substring(0,p);
        name = decodeURIComponent(name);
        var value = list[i].substring(p+1);
        value = decodeURIComponent(value);
        cookie[name] = value;
      }
      return cookie;
    },
    remove:function(parent,child){
      return parent.removeChild(child);
    },
    addEvent:function(node,type,handle){
      if(document.addEventListener){
        return node.addEventListener(type,handle,false);
      }else{
        return node.attachEvent('on' + type,handle);
      }
    },
    delEvent:function(node,type,handle){
      if(document.removeEventListener){
        return node.removeEventListener(type,handle);
      }else{
         return node.detachEvent('on' +type,handle);
      }
    },
    getAjax:function(url, qs, callback) {
      if (qs !== 'undefined'&& typeof qs !== 'function') {
        var pairs = [];
        for (var name in qs) {
          if (!qs.hasOwnProperty(name)) continue;
          if (typeof qs[name] === 'function') continue;
          var value = qs[name].toString();
          name = encodeURIComponent(name);
          value = encodeURIComponent(value);
          pairs.push(name + '=' + value);
        }
        var qstring = pairs.join('&');
        url = url + '?' + qstring;
      }else{
        callback =qs;
      }
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            console.log('ok');
            var source = JSON.parse(xhr.responseText);
            if (typeof callback == 'function') {
              callback(source);
            }
          } else {
            console.log('Request was unsuccessful:' + xhr.status);
          }
        }
      }
      xhr.open('get', url, true);
      xhr.send(null);
    },
    bug:function(message){
      try {
        console.log(message);
      } catch (exception) {
        return;
      }
    },
    addClass: function (node, className){
      var current = node.className || "";
      if ((" " + current + " ").indexOf(" " + className + " ") === -1) {
        node.className = current? ( current + " " + className ) : className;
      }
    },
    delClass: function (node, className){
      var current = node.className || "";
      node.className = (" " + current + " ").replace(" " + className + " ", " ").trim();
    },
    replaceClass:function(node,oClass,nClass){
      var current = node.className || '';
      if((' ' + current + ' ').indexOf(' ' + oClass + ' ') === -1){
        return;}else{
         current = current.replace(oClass,nClass);}
      },
    emitter: {
      // 注册事件
      on: function(event, fn) {
        var handles = this._handles || (this._handles = {}),
          calls = handles[event] || (handles[event] = []);

        // 找到对应名字的栈
        calls.push(fn);

        return this;
      },
      // 解绑事件
      off: function(event, fn) {
        if(!event || !this._handles) this._handles = {};
        if(!this._handles) return;

        var handles = this._handles , calls;

        if (calls = handles[event]) {
          if (!fn) {
            handles[event] = [];
            return this;
          }
          // 找到栈内对应listener 并移除
          for (var i = 0, len = calls.length; i < len; i++) {
            if (fn === calls[i]) {
              calls.splice(i, 1);
              return this;
            }
          }
        }
        return this;
      },
      // 触发事件
      emit: function(event){
        var args = [].slice.call(arguments, 1),
          handles = this._handles, calls;

        if (!handles || !(calls = handles[event])) return this;
        // 触发所有对应名字的listeners
        for (var i = 0, len = calls.length; i < len; i++) {
          calls[i].apply(this, args)
        }
        return this;
      }
    }

  }
})()
