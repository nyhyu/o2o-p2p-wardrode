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

    /**
     * 加载提示层
     * @param target 插入目标位置
     * @return id
     */
    function loading(target) {
        var target = target ? exports.paramJquery(target) : $("body");
        var loadingId = "loadingLayer" + new Date().getTime();
        if (!$(".loading-layer").size()) {
            var loadingHtml = "";
            loadingHtml += '<div class="loading-layer">';
            loadingHtml += '<div class="loading-tips">数据加载中...</div>';
            loadingHtml += '<div class="loading-mask"></div></div>';
            target.append(loadingHtml);
        }
        $(".loading-layer").show();
    }


    /**
     * 关闭加载提示
     */
    function unLoading() {
        $(".loading-layer").hide();
    }


    /**
     * 为必填写添加星号
     */
    exports.addStar = function () {
        $(".req").each(function () {
            $th = $(this).parent().prev();
            if (!$th.text().startWith("\\*")) {
                $th.prepend("<span class=\"red\">* </span>");
            }
        });
    };


    /**
     * 防拷贝
     */
    exports.noCopy = function () {
        $(".nocopy").each(function (i) {
            $(this).css({
                color: "darkgray"
            });
            $(this).bind("selectstart", function () {
                event.returnValue = false;
            });
        });
    };


    /**
     * 回车自动跳转聚焦，backspace失效处理
     */
    exports.keydownEvent = function () {
        exports.enterEvent();
        $(document).bind("keydown", function (event) {
            exports.backspaceForbiden(event);
        });
    };


    /**
     * 回车键特殊处理
     */
    exports.enterEvent = function () {
        var $input = $("input,select");
        $input.live("keypress", function (e) {
            var keyCode = exports.getEventKeyCode(e);
            if (keyCode == 13 && this.form) {
                for (var i = 0; i < this.form.elements.length; i++) {
                    if (this == this.form.elements[i]) break;
                }
                i = (i + 1) % this.form.elements.length;
                this.form.elements[i].focus();
                return false;
            } else {
                return true;
            }
        });
    };


    /**
     * backspace键特殊处理
     * @return
     */
    exports.backspaceForbiden = function (event) {
        var keyCode = exports.getEventKeyCode(event);
        //判断按键为backSpace键
        if (keyCode == 8) {
            //获取按键按下时光标做指向的element
            var elem = event.srcElement || event.target;
            //判断是否需要阻止按下键盘的事件默认传递
            var name = elem.nodeName;
            if (name != 'INPUT' && name != 'TEXTAREA') {
                return _stopIt(event);
            }
            var type_e = elem.type.toUpperCase();
            if (name == 'INPUT' && (type_e != 'TEXT' && type_e != 'TEXTAREA' && type_e != 'PASSWORD' && type_e != 'FILE')) {
                return _stopIt(event);
            }
            if (name == 'INPUT' && (elem.readOnly == true || elem.disabled == true)) {
                return _stopIt(event);
            }
        }
        function _stopIt(e) {
            if (e.returnValue) {
                e.returnValue = false;
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
            return false;
        };
    };


    /**
     * 获得事件源的keycode
     * @param event
     * @returns {Number}
     */
    exports.getEventKeyCode = function (event) {
        return event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    };


    /**
     * 获取可视区宽高
     */
    exports.clientWidth = function () {
        return $(window).width();
    };
    exports.clientHeight = function () {
        return $(window).height();
    };


    /**
     * 判断对象是否隐藏
     * @param obj
     * @returns boolean
     */
    exports.isShow = function (obj) {
        var obj = exports.paramJquery(obj);
        if (obj.is(":hidden")) {
            return false;
        }
        return true;
    };

    /**
     * 获取URL 参数
     * @param name
     * @returns {*}
     */
    exports.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return (r[2]);
        return "";
    }


    /**
     * 添加cookie
     * @param obj
     * @returns boolean
     */
    exports.addCookie = function (name, value, iDay) {
        var oDate = new Date();
        var year = oDate.getFullYear();
        var month = oDate.getMonth() + 1;
        var date = oDate.getDate();
        oDate.setDate(oDate.getDate() + iDay);
        document.cookie = name + '=' + value + ';expires=' + oDate;
    };


    /**
     * 获取cookie
     * @param obj
     * @returns boolean
     */
    exports.getCookie = function (name) {
        var arr = document.cookie.split('; ');
        for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split('=');
            if (arr2[0] == name) return arr2[1];
        }
        return "";
    };


    /**
     * 删除cookie
     * @param obj
     * @returns boolean
     */
    exports.removeCookie = function (name) {
        exports.addCookie(name, 1, -1);
    };


    /**
     * 函数参数初始化（对象和id兼容初始化）
     * @param param
     * @returns {*}
     */
    exports.paramJquery = function (param) {
        var paramObj;
        if (typeof(param) == 'object' && param instanceof jQuery) {
            paramObj = param;
        } else if (typeof(param) == 'object') {
            paramObj = $(param);
        } else if (typeof(param) == 'string') {
            paramObj = $("#" + param);
        }
        return paramObj;
    };


    /* 异步post请求，用于表单提交
     * @param url 请求地址
     * @param data 参数
     * @param callback 回调函数
     */
    exports.ajaxPost = function (url, param, callback, target) {
        var target = target ? target : $("body");
       loading(target);
        $.ajax({
            type: "POST",
            cache: false,
            url: url,
            data: param,
            success: function (result) {
                if (callback) callback(result);
            },
            error: function (xhr, error) {
                if (callback) callback(error);
            },
            complete: function (xhr, ts) {
                unLoading();
            }
        });
    };

    /* 异步post请求，用于表单提交
     * @param url 请求地址
     * @param data 参数
     * @param callback 回调函数
     */
    exports.ajaxPostUrlHome = function (url, param, callback, target) {
        var target = target ? target : $("body");
        $.ajax({
            type: "POST",
            cache: false,
            url: url,
            data: param,
            success: function (result) {
                if (callback) callback(result);
            },
            error: function (xhr, error) {
                if (callback) callback(error);
            },
            complete: function (xhr, ts) {
            }
        });
    };


    /* 异步post请求，用于表单提交
     * @param url 请求地址
     * @param data 参数
     * @param callback 回调函数
     */
    exports.ajaxGet = function (url, param, callback, target) {
        var target = target ? target : $("body");
        loading(target);
        $.ajax({
            type: "GET",
            cache: false,
            url: url,
            data: param,
            success: function (result) {
                if (callback) callback(result);
            },
            error: function (xhr, error) {
                if (callback) callback(error);
            },
            complete: function (xhr, ts) {
                unLoading();
            }
        });
    };


    /**
     * 局部ajax请求
     * @param id 要刷新内容id
     * @param url
     * @param data 参数
     * @param callback 回调函数
     */
    exports.ajaxRefPart = function (id, url, param, callback) {
        var partId = exports.paramJquery(id);
        exports.ajaxGet(url, param, function (result) {
            partId.html(result);
            if (callback) callback();
        }, partId);
    };


    /**
     * 选项卡
     * @param id
     * @param callback 回调函数
     */
    exports.tab = function (id, callback) {
        var oParent = exports.paramJquery(id);
        var tabNav = oParent.find(".tab-nav").children("li");
        var tabPanel = oParent.find(".tab-body").children(".panel");
        var tarId = "";
        tabNav.unbind("click").bind("click", function () {
            $(this).addClass("active").siblings().removeClass("active");
            tabPanel.eq($(this).index()).show().siblings().hide();
            if (callback) {
                tarId = tabPanel.eq($(this).index()).attr("tar-id") ? tabPanel.eq($(this).index()).attr("tar-id") : "index-" + $(this).index();
                callback(tarId);
            }
        });
        if (!oParent.find(".tab-nav").find(".active").size()) {
            tabNav.eq(0).click();
        }
    }


    /**
     * 侧边栏
     * @param id
     * @param callback 回调函数
     */
    exports.sidebar = function (callback) {
        var sidebar = $("#sidebar");
        var type = sidebar.attr("data-type");
        var sidebarBtn = sidebar.find(".sidebar-btn");
        var sidebarCnt = sidebar.find(".sidebar-cnt");
        sidebar.show();
        var width = sidebarCnt.width();
        var height = sidebarCnt.height() > $(window).height() ? $(window).height() : sidebarCnt.height();
        var top = ($(window).height() - height) / 2;
        sidebar.attr("data-open", "0");
        sidebarCnt.css({"width": 0});
        //sidebarBtn.css({"margin-top":(height-120) / 2});
        sidebar.css({"height": height, "top": top});
        sidebarBtn.die().live("click", function () {
            var isOpen = Math.floor(sidebar.attr("data-open"));
            if (isOpen) {
                sidebar.attr("data-open", "0");
                sidebarCnt.stop().animate({width: 0});
                sidebar.css("position", "fixed");
                if(type == "new"){
                    sidebarBtn.html("新手引导");
                }else{
                    sidebarBtn.html("实时统计");
                }

                $(".silder-warp").hide();
            } else {
                sidebar.attr("data-open", "1");
                sidebarCnt.stop().animate({width: width});
                sidebar.css("position", "absolute");
                sidebarBtn.html("收起<i class='hide-icon'></i>");
                $(".silder-warp").show();
            }
            if (callback) callback(isOpen);
            return false;
        });
    }


    /**
     * 批量操作鼠标移上移出功能
     * @param id
     * @param callback 回调函数
     */
    exports.mouseenter = function () {
        var ul = $(".w-batch");
        var li = $(".w-batch").find("li");

        li.die().live("mouseenter", function () {
            var n = $(this).index();
            if (n == 0) {
                $(this).stop(true, true).animate({
                    "margin-left": "-10px",
                    "margin-top": "-60px",
                    "width": "240px",
                    "height": "240px",
                    "line-height": "240px"
                });
            }
            if (n == 1) {
                $(this).stop(true, true).animate({
                    "margin-right": "-10px",
                    "margin-top": "-60px",
                    "width": "240px",
                    "height": "240px",
                    "line-height": "240px"
                });
            }
            if (n == 2) {
                $(this).stop(true, true).animate({
                    "margin-left": "-10px",
                    "margin-bottom": "-60px",
                    "width": "240px",
                    "height": "240px",
                    "line-height": "240px"
                });
            }
            if (n == 3) {
                $(this).stop(true, true).animate({
                    "margin-right": "-10px",
                    "margin-bottom": "-60px",
                    "width": "240px",
                    "height": "240px",
                    "line-height": "240px"
                });
            }
        }).live("mouseleave", function () {
            var n = $(this).index();
            if (n == 0) {
                $(this).stop(true, true).animate({
                    "margin-left": "50px",
                    "margin-top": "0",
                    "width": "240px",
                    "height": "240px",
                    "width": "180px",
                    "height": "180px",
                    "line-height": "180px"
                });
            }
            if (n == 1) {
                $(this).stop(true, true).animate({
                    "margin-right": "0",
                    "margin-top": "0",
                    "width": "180px",
                    "height": "180px",
                    "line-height": "180px"
                });
            }
            if (n == 2) {
                $(this).stop(true, true).animate({
                    "margin-left": "50px",
                    "margin-bottom": "0",
                    "width": "180px",
                    "height": "180px",
                    "line-height": "180px"
                });
            }
            if (n == 3) {
                $(this).stop(true, true).animate({
                    "margin-right": "0",
                    "margin-bottom": "0",
                    "width": "180px",
                    "height": "180px",
                    "line-height": "180px"
                });
            }
        });
    }


    /**
     * 滑动选项卡
     * @param id  执行对象ID
     * @param type 选项卡类型
     */
    exports.slider = function (id, type) {
        // 显示类型1为滑动2为透明度
        var disType = Math.floor(type.charAt(0));
        // 是否创建切换按钮和左右切换 1 底部btn 2左右btn 3全部创建 4全部不创建
        var btnType = Math.floor(type.charAt(1));
        var automatic = Math.floor(type.charAt(2));
        var obj = exports.paramJquery(id);
        var oUl = obj.children("ul");
        var aLi = oUl.children("li");
        var now = 0;
        obj.css({"overflow": "hidden", "position": "relative"});
        if (disType == 1) {
            var maxWidth = aLi.eq(0).width() * aLi.size();
            oUl.css({"width": maxWidth, "position": "absolute", "top": "0", "left": "0"});
        } else if (disType == 2) {
            aLi.css({"position": "absolute", "top": "0", "left": "0"});
        }
        if (btnType == 1) {
            var btnarr = ['<div class="common-eller-btn"><span>'];
            for (var i = 0; i < aLi.size(); i++) {
                i ? btnarr.push('<a href="#@"></a>') : btnarr.push('<a class="active" href="#@"></a>');
            }
            btnarr.push('<span></div>');
            obj.append(btnarr.join(""));
        } else if (btnType == 3) {
            var btnarr = ['<a class="common-eller-left iconfont" title="上一个" href="#@">&#xf016e;</a>'];
            btnarr[btnarr.length] = ['<a class="common-eller-right iconfont" title="下一个" href="#@">&#xf016d;</a>'];
            btnarr[btnarr.length] = ['<div class="common-eller-btn"><span>'];
            for (var i = 0; i < aLi.size(); i++) {
                i ? btnarr.push('<a href="#@"></a>') : btnarr.push('<a class="active" href="#@"></a>');
            }
            btnarr.push('</span></div>');
            obj.append(btnarr.join(""));
        }
        function next() {
            now++;
            if (now == aLi.size()) now = 0;
            tab();
        }

        function tab() {
            if (disType == 1) {
                oUl.stop().animate({"left": -(aLi.eq(0).width() * now)}, function () {
                    obj.find(".common-eller-btn").find("a").eq(now).addClass("active").siblings().removeClass("active");
                });
            } else if (disType == 2) {

            }
        }
        if (automatic) setInterval(next, 5000);
        obj.find(".common-eller-btn").find("a").die().live("click", function () {
            now = $(this).index();
            tab();
        });
        obj.find(".common-eller-left").die().live("click", function () {
            now--;
            if (now < 0) now = aLi.size() - 1;
            tab();
        });
        obj.find(".common-eller-right").die().live("click", function () {
            now++;
            if (now == aLi.size()) now = 0;
            tab();
        });
    }

});