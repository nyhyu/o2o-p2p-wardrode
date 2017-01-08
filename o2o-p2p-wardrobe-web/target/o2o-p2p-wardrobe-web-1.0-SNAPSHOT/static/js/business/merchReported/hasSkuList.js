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

        elem.queryBtn = elem.pageObj.find(".queryBtn");

        elem.skuIdStation = elem.pageObj.find(".skuId_station_lspweb");

        elem.exitPlan = elem.pageObj.find(".exit_plan");

    }


    //绑定事件
    function bindEvent() {

        var $ = require("jquery");
        var util = require("util");
        var dialog = require("dialog");
        var form = require("form");
        var datePicker = require("datePicker");
        var pageid = "pageEnrol";

        //查看门店信息
        elem.skuIdStation.die().live("click", function () {

            var planingCodeTd = $("#planingCodeTd").val();
            var floorCodeTd = $("#floorCodeTd").val();
            var floorGroupCodeTd = $("#floorGroupCodeTd").val();
            var venderCodeTd = $(this).attr("data-venderCode");
            var promotionStateTd = $(this).attr("data-promotion");
            var skuIdTd = $(this).attr("data-skuId");

            dialog.openUrlContent({
                id: "stationInfoPop",
                title: "查询门店",
                url: webRootPath + "/planInfoVenderManager/querySkuStationPage?planingCode=" + planingCodeTd + "&floorCode="
                + floorCodeTd + "&floorGroupCode=" + floorGroupCodeTd +
                "&venderCode=" + venderCodeTd + "&skuId=" + skuIdTd + "&promotionState=" + promotionStateTd,
                width: 780,
                height: 400
            });
        });


        ////查看审核驳回原因
        //elem.browseReason.die().live("click", function () {
        //    var planingCodeTd = $("#planingCodeTd").val();
        //    var floorCodeTd = $("#floorCodeTd").val();
        //    var floorGroupCodeTd = $("#floorGroupCodeTd").val();
        //    var venderCodeTd = $("#venderCodeTd").val();
        //    var skuIdTd = $(this).find("input[name='skuId_AClass_TD']").val();
        //    util.ajaxPost("/planInfoVenderManager/queryReviewDesc",
        //        {
        //            planingCode: planingCodeTd, floorCode: floorCodeTd,
        //            floorGroupCode: floorGroupCodeTd, venderCode: venderCodeTd,
        //            skuId: skuIdTd
        //        }, function (result) {
        //            if (result) {
        //                dialog.alert(result.reviewDesc);
        //            } else {
        //                dialog.alert("查询原因失败");  //失败的错误提示
        //            }
        //        });
        //});

        //退出活动
        elem.exitPlan.die().live("click", function () {
            var planingCodeTd = $("#planingCodeTd").val();
            var floorCodeTd = $("#floorCodeTd").val();
            var floorGroupCodeTd = $("#floorGroupCodeTd").val();
            var venderCodeTd = $("#venderCodeTd").val();
            var skuIdTd = $(this).find("input[name='skuId_AClass_TD']").val();
            var promotionStateTd = $(this).find("input[name='promotionState_AClass_TD']").val();
            util.ajaxPost("/planInfoVenderManager/exitPlan",
                {
                    planingCode: planingCodeTd, floorCode: floorCodeTd,
                    floorGroupCode: floorGroupCodeTd, venderCode: venderCodeTd,
                    skuId: skuIdTd, promotionState: promotionStateTd
                }, function (result) {
                    if (result.code == 0) {
                        dialog.alert("操作成功");
                        $("#skuDiv").find(".query").click();
                    } else {
                        dialog.alert("操作失败");  //失败的错误提示
                    }
                });
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
