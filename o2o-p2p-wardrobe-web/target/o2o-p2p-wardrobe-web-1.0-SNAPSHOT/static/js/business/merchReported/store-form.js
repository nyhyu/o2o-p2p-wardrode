 /**
  * 公共方法
  * User: wulewei
  * Date: 15-5-25
  */
define(function (require, exports) {
    //jquery
    var $ = require("jquery");
    //基础方法模块
    var util = require("util");
    //弹窗模块
    var dialog = require("dialog");
    var validate = require('validate');
    //*存页面元素
    var elem = {};

    //获取页面基础元素
    function getElem (pageid) {
        elem.pageObj = util.paramJquery(pageid);
        //搜索模块
        elem.oSearch = elem.pageObj.find(".search");
        //检索按钮
        elem.query = elem.oSearch.find(".query");
        //列表模块
        elem.oTable = elem.pageObj.find(".table");
        //列表行
        elem.alists = elem.oTable.find("tbody").find("tr");
        //全选
        elem.allCheck = elem.pageObj.find(".check-all");
        // 门店列表选中
        elem.inputChange1 = $("#creatStep_1 .table tbody tr td input[type=checkbox]");
        // 商品列表选中
        elem.inputChange2 = $("#creatStep_2 .table tbody tr td input[type=checkbox]");
        //复选框
        //elem.checks = elem.pageObj.find(".check");
        //左右列表模块
        elem.dblist = elem.pageObj.find(".dblist");
        //移动选中行
        elem.allmove = elem.dblist.find(".allmove");
        //抢购价
        elem.promotionPriceTd = elem.oTable.find(".promotionPriceTd");
        //抢购数量
        elem.promotionTd = elem.oTable.find(".promotionTd");
    }


    //绑定事件
    function bindEvent(elem) {
        //查询操作
        elem.query.die().live("click",function(){
            var oParent = elem.pageObj;
            var oSearch = $(this).parents(".search");
            var oSearchForm = oSearch.find("form");
            var action = oSearchForm.attr("action");
            var params = oSearchForm.serialize();
            var oTable = $(this).parents(".search").parent().find(".table");
            if (action) {
                util.ajaxRefPart(oTable, action, params);
            }
        });

        //单击行操作
        elem.alists.die().live("click",function(ev){
            var targetObj, checkContainer ,targetid, allCheck;
            var ev = ev || window.event;
            var oTarget = ev.target || ev.srcElement;
            var check = $(this).find("input[type='checkbox']");
            if (oTarget.tagName.toLowerCase() != "input" && oTarget.tagName.toLowerCase() != "a") {
                if (check.prop('checked')) {
                    check.attr('checked', false);
                } else {
                    check.attr('checked', true);
                    if ($(this).parents(".check-container").attr("data-type") == "only") {
                        check.parents("tr").siblings().find("input[type='checkbox']").attr('checked',false);
                    }
                }
                targetObj = $(this).parents(".check-container");
                if (targetObj.size() > 0) {
                    targetid = targetObj.attr("data-container");
                    allCheck = elem.pageObj.find(".check-all[data-target=" + targetid + "]");
                    checkContainer = elem.pageObj.find(".check-container[data-container=" + targetid + "]");
                    exports.eachCheck(checkContainer, allCheck);
                }
                if(!$("#creatStep_1").is(":hidden")) { //门店
                    checkboxStore(check);
                }else if(!$("#creatStep_2").is(":hidden")) { //商品页
                    checkboxSCommod(check);
                }
                return false;
            }
        });

        //全选操作
		elem.allCheck.die().live("click",function() {
            var checks = null;
            var targetid = $(this).attr("data-target");
            if(!$("#creatStep_1").is(":hidden")){ //门店
                var checkAllState = $("#creatStep_1 .table table").find(".check-all").prop("checked");//全选按钮状态
                if(stationCodeArr.length<30) { //每页长度20条数据
                    if (targetid) {
                        checks = $("#creatStep_1 .table").find("[data-container=" + targetid + "]").find("input[type='checkbox']");
                    } else {
                        checks = $("#creatStep_1 .table tbody").find("input[type='checkbox']");
                    }

                    //checks.attr("checked", $(this).prop("checked"));

                    checks.each(function () {
                        $(this).attr("checked", checkAllState);
                        checkboxStore($(this));
                    });
                }else if(checkAllState){
                    dialog.alert("最多可选50个，此页全选的话超过了最大限制！");
                }
            }else if(!$("#creatStep_2").is(":hidden")){ //商品页
                var checkAllState2 = $("#creatStep_2 .table table").find(".check-all").prop("checked");//全选按钮状态
                if(skuIdArr.length<30) { //每页长度20条数据
                    if (targetid) {
                        checks = $("#creatStep_2 .table").find("[data-container=" + targetid + "]").find("input[type='checkbox']");
                    } else {
                        checks = $("#creatStep_2 .table tbody").find("input[type='checkbox']");
                    }
                    //checks.attr("checked", $(this).prop("checked"));
                    //checks.each(function(){checkboxSCommod($(this));});
                    checks.each(function () {
                        $(this).attr("checked", checkAllState2);
                        checkboxSCommod($(this));
                    });
                }else if(checkAllState2){
                    dialog.alert("最多可选50个，此页全选的话超过了最大限制！");
                }
            }

		});

        //门店点击 checkbox
        elem.inputChange1.die().live("change",function(){
            checkboxStore($(this));
        });
        //商品点击 checkbox
        elem.inputChange2.die().live("change",function(){
            checkboxSCommod($(this));
        });
		
        //多选操作
        //elem.checks.die().live("click",function(){
        //    var targetObj, checkContainer ,targetid, allCheck;
        //    if ($(this).parents("table").size()) {
        //        if ($(this).parents(".check-container").attr("data-type") == "only") {
        //            $(this).parents("tr").siblings().find("input[type='checkbox']").attr('checked', false);
        //        }
        //    }
        //    targetObj = $(this).parents(".check-container");
        //    if (targetObj.size() > 0) {
        //        targetid = targetObj.attr("data-container");
        //        allCheck = elem.pageObj.find(".check-all[data-target=" + targetid + "]");
        //        checkContainer = elem.pageObj.find(".check-container[data-container=" + targetid + "]");
        //        exports.eachCheck(checkContainer, allCheck);
        //    }
        //});

        //检索收起展开
        elem.oSearch.off().on("click",".more",function(){
            if ($(this).attr("data-status") == "hide"){
                $(this).attr("data-status","show");
                $(this).html("收起<i class='search-litter'></i>");
                $(this).parent().find("tr").each(function(){
                    if ($(this).index() > 0) {
                        $(this).attr("class","");
                        $(this).find("input[type='text'],select").val("");
                    }
                });
            } else {
                $(this).attr("data-status","hide");
                $(this).html("显示更多<i class='search-more'></i>");
                $(this).parent().find("tr").each(function(){
                    if ($(this).index() > 0) {
                        $(this).attr("class","none");
                    }
                });
            }
        });


        //全部移动 批量移动
        elem.allmove.die().live("click",function(){
            var dblist = $(this).parents(".dblist ");
            var dblistL = dblist.find(".db-l").find("tbody");
            var dblistR = dblist.find(".db-r").find("tbody");
            if ($(this).parents(".userlist").hasClass("db-l")) {
                if (dblistR.find("tr").size()) {
                    dblistL.find(".move").html("&#xf0112;");
                    dblistL.find("input:checked").parents("tr").insertBefore(dblistR.find("tr").eq(0));
                } else {
                    dblistL.find(".move").html("&#xf0112;");
                    dblistR.append(dblistL.find("input:checked").parents("tr"));
                }
            } else {
                if (dblistL.find("tr").size()) {
                    dblistR.find(".move").html("&#xf0114;");
                    dblistR.find("input:checked").parents("tr").insertBefore(dblistL.find("tr").eq(0));
                } else {
                    dblistR.find(".move").html("&#xf0114;");
                    dblistL.append(dblistR.find("input:checked").parents("tr"));
                }
            }
            exports.eachCheck($(".db-l").find("table"));
            exports.eachCheck($(".db-r").find("table"));
            return false;
        });

        //抢购价
        elem.promotionPriceTd.die().live("blur",function(){
            if($(this).parent().find(".err-tips").length==0){
                var staCode = $(this).parents("tr").find("td").eq(2).text();
                var promotionPriceArrXb = -1;
                if(promotionPriceArr.length>0){
                    promotionPriceArrXb = $.inArray(staCode, skuIdArr);
                }
                if(promotionPriceArrXb>-1){
                    promotionPriceArr[promotionPriceArrXb]=$(this).val();
                }
            }
        });
        //抢购数量
        elem.promotionTd.die().live("blur",function(){
            if($(this).parent().find(".err-tips").length==0){
                var staCode = $(this).parents("tr").find("td").eq(2).text();
                var promotionSizeArrXb = -1;
                if(promotionSizeArr.length>0){
                    promotionSizeArrXb = $.inArray(staCode, skuIdArr);
                }
                if(promotionSizeArrXb>-1){
                    promotionSizeArr[promotionSizeArrXb]=$(this).val();
                }
            }
        });

    }


    //初始化search
    function searchInit () {
        if (elem.oSearch.find(".none").size()){
            elem.oSearch.append('<div class="more" data-status="hide">显示更多<i class="search-more"></i></div>');
        }
    }


    //初始化table
    function tableInit () {
        var checkContainer = elem.pageObj.find("[data-type='only']");
        if (checkContainer.size()) {
            checkContainer.each(function(){
                var targetid = $(this).attr("data-container");
                var allCheck = elem.pageObj.find(".check-all[data-target='" + targetid + "']");
                allCheck.hide();
            });
        }
    }


    //初始化分页
    function pageInit() {
        elem.pageObj.find(".pageCssDefault a").die().live("click", function() {
            if(!$("#creatStep_1").is(":hidden")) { //门店页显示
                var url = $(this).attr("href");
                var target = $(this).parents(".table");
                util.ajaxRefPart(target, url);
                return false;
            }else if(!$("#creatStep_2").is(":hidden")) { //商品页显示
                var allSelRows = $("#creatStep_2").find("tbody").find("input[type=checkbox]:checked").parents("tr");
                allSelRows.each(function(){
                    var isPromotions=$("#promotionType").val();
                    if(isPromotions.length>0){//促销
                        if($(this).find("td").eq(6).find("input").val().length==0){
                            $(this).find("td").eq(6).find("input").blur();
                        }
                        if($(this).find("td").eq(7).find("input").val().length==0){
                            $(this).find("td").eq(7).find("input").blur();
                        }
                    }
                });
                if($("#creatStep_2 .table tbody tr td").parent().find(".err-tips").length==0){
                    var url = $(this).attr("href");
                    var target = $(this).parents(".table");
                    util.ajaxRefPart(target, url);
                    return false;
                }else{
                    return false;
                }

            }
        });
    }


    //页面初始化
    exports.init = function (pageid) {
        //获取页面元素
        getElem(pageid);
        //绑定事件
        bindEvent(elem);
        //初始化search模块
        searchInit();
        //初始化table模块
        tableInit();
        //初始化分页模块
        pageInit();
        validate.init();
    }


    //检索
    exports.searchQuery = function (id){
        var obj = id ? util.paramJquery(id) : $("body");
        obj.find(".query").click();
    }


    //遍历checkbox
    exports.eachCheck = function (oParent, allCheck) {
        var total = oParent.find(".check[type='checkbox']").size();
        var checkSize = oParent.find(".check:checked").size();
        if (total && checkSize == total) {
            allCheck.attr("checked",true);   
        } else {
            allCheck.attr("checked",false);
        }
    }


    //获取选中行
    exports.getAllSelect = function (obj) {
        var obj = obj ? obj : elem.pageObj;
        var allSelRows = obj.find("tbody").find("input:checked").parents("tr");
        return allSelRows;
    }


    //获指定行
    exports.getSelect = function (index) {
        var allSelRows = elem.oTbody.find("tr");
        var selRows = allSelRows.eq(index);
        return selRows;
    }

    function checkboxStore(obj){
            var staCode= obj.parents("tr").find("td").eq(2).text();
            var arrXb = $.inArray(staCode,stationCodeArr);
            if(obj.parents("tr").find("td input[type=checkbox]").is(':checked')){
                if(stationCodeArr.length==0 || arrXb<0){
                    if(stationCodeArr.length<50){
                        stationCodeArr.push(staCode);
                        stationNameArr.push($(this).parents("tr").find("td").eq(1).text());
                    }else{
                        obj.parents("tr").find("td input[type=checkbox]").attr("checked",false);
                        dialog.alert("最多可选50个门店！");
                    }
                }
            }else{
                stationCodeArr.splice(arrXb,1);
                stationNameArr.splice(arrXb,1);
            }
    }

    function checkboxSCommod(obj){
        var staCode= obj.parents("tr").find("td").eq(2).text();
            var skuIdArrXb = $.inArray(staCode,skuIdArr);
            if(obj.parents("tr").find("td input[type=checkbox]").is(':checked')){
                if(skuIdArr.length==0 || skuIdArrXb<0){
                    if(stationCodeArr.length<50) {
                        skuIdArr.push(staCode);
                        skuNameArr.push(obj.parents("tr").find("td").eq(1).text());
                        stationPriceArr.push(obj.parents("tr").find("td").eq(4).text());
                        var isPromotions = $("#promotionType").val();
                        if (isPromotions.length > 0) {//促销
                            promotionPriceArr.push(obj.parents("tr").find("td").eq(6).find("input").val()); //促销价
                            promotionSizeArr.push(obj.parents("tr").find("td").eq(7).find("input").val()); //促销数量
//                            isMainSkuArr.push(obj.parents("tr").find("td").eq(8).find("input[name=commodity-" + staCode + "]:checked").val());
                            isMainSkuArr.push(1);
                            obj.parents("tr").find("td").eq(6).find("input").attr("data-validate","required,isSizeOf,notNegReal,twoDecimal"); //设置为必填
                            obj.parents("tr").find("td").eq(7).find("input").attr("data-validate","posInt,required"); //设置为必填
                        } else {
                            promotionPriceArr.push(-1); //促销价
                            promotionSizeArr.push(-1); //促销数量
//                            isMainSkuArr.push(obj.parents("tr").find("td").eq(6).find("input[name=commodity-" + staCode + "]:checked").val());
                            isMainSkuArr.push(1);
                        }
                    }else{
                        obj.parents("tr").find("td input[type=checkbox]").attr("checked",false);
                        dialog.alert("最多可选50个商品！");
                    }
                }
            }else{
                skuIdArr.splice(skuIdArrXb,1);
                skuNameArr.splice(skuIdArrXb,1);
                stationPriceArr.splice(skuIdArrXb,1);
                promotionPriceArr.splice(skuIdArrXb,1); //促销价
                promotionSizeArr.splice(skuIdArrXb,1); //促销数量
                isMainSkuArr.splice(skuIdArrXb,1);
                obj.parents("tr").find(".err-tips").remove();
                obj.parents("tr").find(".validate").removeClass("err-border");
                obj.parents("tr").find("td").eq(6).find("input").attr("data-validate","isSizeOf,notNegReal,twoDecimal"); //取消必填限制
                obj.parents("tr").find("td").eq(7).find("input").attr("data-validate","posInt"); //取消必填限制
            }
    }
});