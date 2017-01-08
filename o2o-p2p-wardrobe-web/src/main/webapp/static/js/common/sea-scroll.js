/**
 * 公共方法
 * User: wulewei
 * Date: 15-5-25
 */
define(function (require, exports) {

    /**
     * jquery
     * 获取包装后对象和方法
     */
    var jQuery = $ = require("jquery");


    function drag (obj,params) {
        var wrap = params.wrap;
        var content = params.content;
        var scrollWrap = obj;
        var scrollBar = scrollWrap.find(".scroll-bar");

        scrollBar.mousedown(function(ev){
            var ev = ev || window.event;
            var py = ev.clientY - scrollBar.position().top;

            $(document).unbind("mousemove").bind("mousemove", function(ev){
                var t = ev.clientY - py;
                if (t < 0) t = 0;
                if (t > scrollWrap.height() - scrollBar.height()) {
                    t = scrollWrap.height() - scrollBar.height();
                }
                var per = t / (scrollWrap.height() - scrollBar.height()) * 100;
                var mt = (content.height() - wrap.height()) * (per / 100);
                scrollBar.css({"top":t});
                content.stop().animate({"top":-mt},"flast");
            });

            $(document).unbind("mouseup").bind("mouseup", function(){
                $(document).unbind("mousemove");
                $(document).unbind("mouseup");
            });

            return false;
        });
    }


    /**
     * 鼠标滚轮事件
     * return 滚动条对象
     */
    var wheelFlag = 0;
    var speed = 6;
    function mouseWheel(obj,params) {
        var wrap = params.wrap;
        var content = params.content;
        var scrollWrap = obj;
        var scrollBar = scrollWrap.find(".scroll-bar");
        wheelFlag = scrollBar.position().top;
        bind(content, 'mousewheel', function (ev) {
            var status = -getWheelData(ev);
            wheelChange(content, status);
            if (document.all) {
                window.event.returnValue = false;
            } else {
                ev.preventDefault();
            }
        });

        //火狐
        bind(content, 'DOMMouseScroll', function (ev) {
            var status = getWheelData(ev);
            wheelChange(content, status);
            ev.preventDefault();
        });

        function wheelChange(content, status) {
            if (speed) {
                wheelFlag += (status / speed);
            } else {
                wheelFlag = 0;
            }
            if (wheelFlag < 0) wheelFlag = 0;
            if (wheelFlag > scrollWrap.height() - scrollBar.height()){
                wheelFlag = scrollWrap.height() - scrollBar.height();
            }
            var per = wheelFlag / (scrollWrap.height() - scrollBar.height()) * 100;
            var mt = (content.height() - wrap.height()) * (per / 100);
            scrollBar.stop().animate({"top":wheelFlag},"flast");
            content.stop().css({"top":-mt});
        }
    }

    /**
     * 鼠标滚轮事件
     * return num
     */
    function getWheelData(ev) {
        var ev = ev || window.event;
        return ev.wheelDelta ? ev.wheelDelta : ev.detail * 40;
    }


    /**
     * 事件绑定
     * FF or *
     */
    function bind (obj, type, fn) {
        var node = obj[0];
        if (node.addEventListener) {
            node.addEventListener(type, fn, false);
        } else if (node.attachEvent) {
            node.attachEvent('on' + type, fn);
        } else {
            node['on' + type] = fn;
        }
    }


    /**
     * 创建滚动条
     * return 滚动条对象
     */
    var removeTimer = null;
    function createScrollBar(params){
        var wrap = params.wrap;
        var content = params.content;
        var wrapH = params.wrapH;
        var contentH = params.contentH;
        var scrollWrap = wrap.find(".scroll-container");
        var scrollBar = scrollWrap.find(".scroll-bar");
        if (wrapH >= contentH) {
            if (scrollWrap.size()) scrollWrap.remove();
            if (parseInt(content.css("top"),10) < 0) {
                clearTimeout(removeTimer);
                removeTimer = setTimeout(function(){
                    content.stop().animate({"top":"0"},300);
                },200);
            }
            speed = 0;
            return false;
        }

        if ((content.position().top + contentH) < wrapH) {
            var top = wrapH - contentH;
            content.stop().animate({"top":top},300 , function(){
                speed = 6;
                var h = wrapH / contentH * 90;
                if (scrollWrap.size()){
                    scrollWrap.css({height : wrapH});
                    scrollBar.css({height:h + "%"});
                    return false;
                } else {
                    var scrollObj = $('<div class="scroll-container" style="height:' + wrapH + 'px"><span class="scroll-bar" style="height:' + h + '%"><span><div>');
                    return scrollObj;
                }
            });
        } else {
            speed = 6;
            var h = wrapH / contentH * 90;
            if (scrollWrap.size()){
                scrollWrap.css({height : wrapH});
                scrollBar.css({height:h + "%"});
                return false;
            } else {
                var scrollObj = $('<div class="scroll-container" style="height:' + wrapH + 'px"><span class="scroll-bar" style="height:' + h + '%"><span><div>');
                return scrollObj;
            }
        }
    }



    /***********************************************************************
     * 下面方法为调用层
     */


    /**
     * 为必填写添加星号
     */
    exports.init = function (obj) {
        var scroll = {
            wrap : obj,                                     //外层
            content : obj.find(".menu-list"),                       //内容
            wrapH : obj.height(),                           //外层高度
            contentH : obj.children().height()              //内容高度
        }
        //创建滚动条
        var scrollBar = createScrollBar(scroll);

        if (scrollBar) {
            //拖拽事件
            drag(scrollBar,scroll);
            //滚轮事件
            mouseWheel(scrollBar,scroll);

            scroll.wrap.append(scrollBar);
        }
    };
});