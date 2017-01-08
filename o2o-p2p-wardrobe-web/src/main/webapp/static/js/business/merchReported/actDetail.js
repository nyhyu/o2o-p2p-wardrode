/**
 * hello
 * User: yaofengjiao
 * Date: 16-05-12
 */
define(function (require, exports) {
    //引入依赖模块
    var $ = require("jquery");
    var util = require("util");
//    var form = require("form");
    var elem = {};
    var pageid = "pageDetail";

    $(function(){
        //获取页面元素
        getElem();
        //绑定事件
        bindEvent();
        //初始化
        pageLoad();
    });


    //获取页面基础元素
    function getElem () {
        //绑定外层元素对象
        elem.pageObj = util.paramJquery(pageid);
        //鼠标滑过 放大图片
        elem.enlargePicture = $(".p-img");
    }


    //绑定事件
    function bindEvent () {

        //鼠标滑过 放大图片
        elem.enlargePicture.die().live("hover" , function (event){
            if(event.type=='mouseenter'){
                var eSrc= $(this).find("img").attr("src");
                if(eSrc.indexOf("/n4/")>=0){
                    eSrc=eSrc.replace("/n4/","/n2/");
                }
                $(this).parent().find(".enlarge img").attr("src",eSrc);
                $(this).parent().find(".enlarge").css('display','inline-block'); ;
            }else{
                $(this).parent().find(".enlarge").hide();
            }
        });






    }

    //初始化
    function pageLoad () {

//        util.tab(pageid, function(id){
//            form.init(id);
//            form.searchQuery();
//        });
//        util.mouseenter();
    }

});
