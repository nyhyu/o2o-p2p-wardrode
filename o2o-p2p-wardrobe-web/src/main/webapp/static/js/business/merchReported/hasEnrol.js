/**
 * hello
 * User: yaofengjiao
 * Date: 16-05-12
 */
define(function (require, exports) {
    //引入依赖模块
    var $ = require("jquery");
    var util = require("util");
    var dialog = require("dialog");
    var form = require("form");
    var datePicker = require("datePicker");
    var elem = {};
    var pageid = "pageEnrol";

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
        //参与报名
        elem.enrolActHas = elem.pageObj.find(".enrolAct_has");
    }


    //绑定事件
    function bindEvent () {
        //参与报名
        elem.enrolActHas.die().live("click",function(){
            var planingId=$(this).parents("tr").find("td").eq(0).find("a").attr("data-value");
            var planingCode=$(this).parents("tr").find("td").eq(4).find("a").attr("data-value");
            var planingName=$(this).parents("tr").find("td").eq(0).find("a").text();
            var venderCode = $("#venderCode").val();
            var params={
                "planingCode":planingCode,
                "venderCode":venderCode
            };
            dialog.confirm("您确定要参与"+$(this).parents("tr").find("td").eq(0).find("a").text()+"活动报名吗？",function(){
                util.ajaxPost("/planning/updateState",params,function(result){
                    if(result=="1"){
                        window.location.href="/planingFloor/viewPlaningFloorList?planingName="+planingName+"&planingId="+planingId+"&planingCode="+planingCode;
                    } else{
                        dialog.alert("活动"+planingName+"报名失败！")
                    }
                });
            });

        });

    }

    //初始化
    function pageLoad () {
        form.init(pageid);
        form.searchQuery(pageid);
        util.tab(pageid, function(id){
            form.init(id);
            form.searchQuery(id);
        });
    }

});
