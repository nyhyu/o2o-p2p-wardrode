 /**
  * hello
  * User: wulewei
  * Date: 15-5-25
  */
define(function (require, exports) {
    
    //引入依赖模块
    var $ = require("jquery");
    var util = require("util");
    var scroll = require("scroll");
    var elem = {};

    //获取页面元素
    function getElem(pageid){
        elem.pageObj = $("#" + pageid);
        elem.menu = elem.pageObj;
        elem.menus = elem.pageObj.find("a");
    }

    //绑定事件
    function bindEvent(){
        var curHref = "";
        elem.menus.unbind("click").bind("click",function(){
            if ($(this).attr("href") != "" && $(this).attr("href") !="#@") {
                if ($(this).attr("href") == curHref){
                    try{
                       $("#middle").contents().find("#frameContent").attr("src", curHref);
                    }catch(e){}
                    return false;
                }
            }
            curHref = $(this).attr("href");
            var oLevel = $(this).next();
            if (oLevel.size()) {
                if (util.isShow(oLevel)) {
                    oLevel.stop().animate({"height":0},function(){
                        oLevel.attr("style","display:none");
                        scroll.init($("#menu"));
                    });
                    //清空选中样式
                    oLevel.prev().removeClass("active");
                    //清空当前项下选中样式
                    oLevel.find("a").removeClass("active");
                    //折叠当前项下展开内容
                    oLevel.find("ul").each(function(){
                        if (util.isShow($(this))) {
                            $(this).stop().animate({"height":0},function(){
                                $(this).attr("style","display:none");
                                scroll.init($("#menu"));
                            });
                        }
                    });
                } else {
                    var h = oLevel.height();
                    oLevel.css({"height":"0"}).show();
                    oLevel.stop().animate({"height":h},function(){
                        oLevel.attr("style","display:block");
                        scroll.init($("#menu"));
                    });
                    oLevel.prev().addClass("active").parents("li").siblings().find("a").removeClass("active");;
                    var siblings = oLevel.parents("li").siblings().find("ul");
                    siblings.each(function(){
                        if (util.isShow($(this))) {
                            $(this).stop().animate({"height":0},function(){
                                $(this).attr("style","display:none");
                                scroll.init($("#menu"));
                            });
                            $(this).prev().removeClass("active");
                        }
                    });
                }
            } else {
                if ($(this).hasClass("active"))  {
                    $(this).removeClass("active"); 
                } else {
                    $(this).addClass("active").parents("li").siblings().find("a").removeClass("active");
                    var siblings = $(this).parents("li").siblings().find("ul");
                    siblings.each(function(){
                        $(this).stop().animate({"height":0},function(){
                            $(this).attr("style","display:none");
                            scroll.init($("#menu"));
                        });
                        $(this).prev().removeClass("active");
                    });
                }
            }
        });
    };

    //初始化菜单
    function menuRefresh(){
        $("#menu").css({height:$(window).height() - 80});
        scroll.init($("#menu"));
    }


    //页面加载完成事件
    function pageLoad(){
        menuRefresh();
    };


    //加载完成
    $(function(){
        //获取页面元素
        var elem = getElem("menu");
        //绑定事件
        bindEvent(elem);
        //页面加载完成事件
        pageLoad();
        //销毁
        elem = null;
    });


    $(window).resize(function(){
        menuRefresh();
    });

});
