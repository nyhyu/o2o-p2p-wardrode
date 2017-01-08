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

    $(function () {
        //获取页面元素
        getElem();
        //绑定事件
        bindEvent();
        //初始化
        pageLoad();
    });


    //获取页面基础元素
    function getElem() {
        //绑定外层元素对象
        elem.pageObj = util.paramJquery(pageid);
        //参与报名
        elem.seeDataA = elem.pageObj.find(".seeDataA");

        elem.detailPlanA = elem.pageObj.find(".detailPlanA");

    }


    //绑定事件
    function bindEvent() {
        //参与报名
        elem.seeDataA.die().live("click", function () {
            var tr = $(this).parents("tr");
            var planingId = tr.find(".planingIdA").val();
            var planingCode = tr.find(".planingCodeA").val();
            var planingName = tr.find(".planingNameA").val();

            window.location.href = "/planingFloor/viewPlaningFloorList?&planingId=" + planingId + "&planingCode=" + planingCode+"&planingName=" + planingName ;
        });


        //参与报名
        elem.detailPlanA.die().live("click", function () {
            var tr = $(this).parents("tr");
            var planingId = tr.find(".planingIdA").val();
            var planingCode = tr.find(".planingCodeA").val();
            var planingName = tr.find(".planingNameA").val();

            window.location.href = "/planning/detailPage?planingId=" + planingId + "&planingCode=" + planingCode+"&planingName=" + planingName ;
        });
    }

    //初始化
    function pageLoad() {
        form.init(pageid);
        form.searchQuery(pageid);
        util.tab(pageid, function (id) {
            form.init(id);
            form.searchQuery(id);
        });
        // util.mouseenter();
    }

});
