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
        //复选框
        elem.checks = elem.pageObj.find(".check");
        //左右列表模块
        elem.dblist = elem.pageObj.find(".dblist");
        //移动选中行
        elem.allmove = elem.dblist.find(".allmove");
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
                return false;
            }
        });

        //全选操作
		elem.allCheck.die().live("click",function() {
			var checks = null;
			var targetid = $(this).attr("data-target");
			if (targetid) {
				checks = elem.pageObj.find("[data-container=" + targetid + "]").find("input[type='checkbox']");
			} else {
				checks = elem.pageObj.find("input[type='checkbox']");      
			}
			checks.attr("checked", $(this).prop("checked"));
		});
        
		
        //多选操作
        elem.checks.die().live("click",function(){
            var targetObj, checkContainer ,targetid, allCheck;
            if ($(this).parents("table").size()) {
                if ($(this).parents(".check-container").attr("data-type") == "only") {
                    $(this).parents("tr").siblings().find("input[type='checkbox']").attr('checked', false);
                }                
            }
            targetObj = $(this).parents(".check-container");
            if (targetObj.size() > 0) {
                targetid = targetObj.attr("data-container");
                allCheck = elem.pageObj.find(".check-all[data-target=" + targetid + "]");
                checkContainer = elem.pageObj.find(".check-container[data-container=" + targetid + "]");
                exports.eachCheck(checkContainer, allCheck);
            }
        });

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
            var url = $(this).attr("href");
            var target = $(this).parents(".table");
            util.ajaxRefPart(target, url);
            return false;
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
});