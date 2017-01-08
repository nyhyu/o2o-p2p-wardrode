/**
 * hello
 * User: yaofengjiao
 * Date: 16-05-16
 */
define(function(require,exports){
    var $ = require('jquery');
    var dialog = require('dialog');
    var util = require('util');
    var validate = require('validate');
    //var form = require('form');store-form.js
    var form = require('/static/js/business/merchReported/store-form.js');
    var pageMod = require('/static/js/common/sea-page.js');
    var elem = {};
//    var pageid = "dashboard";
    var pageid = "creatStep_1";


    var planingApplyList =[];//商品信息数组

    //分页控件
    var pageTemplet1 = null;
    var rows = 10;   //每页行数

    $(function(){
        //获取页面元素
        getElem();
        //绑定事件
        bindEvent();
        //初始化
        pageLoad();
        //
        $('input[type=checkbox]').click(function () {
            this.blur();
            this.focus();
        });
    });

    //获取页面基础元素
    function getElem () {
        //绑定外层元素对象
        elem.pageObj = util.paramJquery(pageid);
        // 商品列表选中主备品
//        elem.radioChange2 = $("#creatStep_2 .table tbody tr td input[type=radio]");

        //添加门店页的“下一步”
        elem.nextStep1 = $("#nextStep1");
        //添加商品页的“上一步”
        elem.prevStep2 = $("#prevStep2");
        //添加商品页的“下一步”
        elem.nextStep2 = $("#nextStep2");
        //确认页的“上一步”
        elem.prevStep3 = $("#prevStep3");
        //确认页的“确认提交”
        elem.nextStep3 = $("#nextStep3");
        //门店信息
        elem.stationInfo = $(".enrolAct");
    }

    //绑定事件
    function bindEvent () {
        // 商品列表选中主备品
//        elem.radioChange2.die().live("click",function(){
//            var staCode = $(this).parents("tr").find("td").eq(2).text();
//            var skuIdArrXb = -1;
//            if(skuIdArr.length>0){
//                skuIdArrXb = $.inArray(staCode, skuIdArr);
//            }
//            if(skuIdArrXb>-1){
//                isMainSkuArr[skuIdArrXb]=$(this).val();
//            }
//        });
        //添加门店页的“下一步”
        elem.nextStep1.die().live("click",function(){
            if (stationCodeArr.length>0) {
                $("#stationCode").val(stationCodeArr.join(","));
                form.init("creatStep_2");
                form.searchQuery("creatStep_2");
                $("#creatStep_1").hide();
                $("#creatStep_2").show();
                $("#creatStep_3").hide();
                //如果存在历史促销规则数据
                if($("#limitTypePin").val()==1 || $("#limitTypeDevice").val()==1 || $("#limitSize").val().length>0){
                    if($("#limitTypePin").val()==1) $("#limitPin").attr("checked",true);
                    if($("#limitTypeDevice").val()==1) $("#limitDevice").attr("checked",true);
                    if($("#limitSize").val().length>0) $("#limitCount").val($("#limitSize").val());
                    //设置只读
                    $("#limitPin").attr("disabled","disabled");
                    $("#limitDevice").attr("disabled","disabled");
                    $("#limitCount").attr("disabled","disabled");
                }
            } else {
                dialog.alert("至少选择一条");
            }
        });
        //添加商品页的“上一步”
        elem.prevStep2.die().live("click",function(){
                $("#creatStep_1").show();
                $("#creatStep_2").hide();
                $("#creatStep_3").hide();
        });
        //添加商品页的“下一步”
        elem.nextStep2.die().live("click",function(){
            //如果是促销，则验证下促销限购数量
            var isPromotions=$("#promotionType").val();
            if(isPromotions) {
                var limitCount_var = $("#limitCount").val(); //限购数量
                if (limitCount_var.length<1 || limitCount_var < 0) {
                    dialog.alert("请输入正确的限购数量");
                    return;
                }
            }
            if (skuIdArr.length > 0) {
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
                    $("#creatStep_1").hide();
                    $("#creatStep_2").hide();
//                pageTemplet1.refresh(page, total);
                    creatList(1);
                    creatTitle();
                    pageTemplet1.refresh(1, skuIdArr.length);
                    $("#creatStep_3").show();
                }
            } else {
                dialog.alert("至少选择一条");
            }
        });
        //确认页的“上一步”
        elem.prevStep3.die().live("click",function(){
            $("#creatStep_1").hide();
            $("#creatStep_2").show();
            $("#creatStep_3").hide();
        });
        //确认页的“确认提交”
        elem.nextStep3.die().live("click",function(){
            var formData={};//提报商品的总数组
            $(this).attr("disabled", true);
//        formData.is_ignore_conflict="0";
//            formData.limit_station=rootData.rows;  //已选门店
//            formData.limit_sku=hasCommoditiesData.rows;  //已选商品
//            var aa= JSON.stringify(formData);
            for(var i=0;i<stationCodeArr.length;i++){
                for(var j=0;j<skuIdArr.length;j++){
                    var planingApplyObj={ };
                    planingApplyObj.stationCode=stationCodeArr[i];
                    planingApplyObj.stationName=stationNameArr[i];
                    planingApplyObj.skuId=skuIdArr[j];
                    planingApplyObj.skuName=skuNameArr[j];
                    var price=$.trim(stationPriceArr[j]);
                    if(price.length>0){
                        planingApplyObj.stationPrice=price*1000/10;
                    }
                    var promotionPrice=$.trim(promotionPriceArr[j]);
                    if(promotionPrice==-1){
                        planingApplyObj.promotionPrice =-1;
                    }else if(promotionPrice.length>0) {
                        planingApplyObj.promotionPrice = promotionPrice * 1000 / 10;
                    }
                    planingApplyObj.size=promotionSizeArr[j];
                    planingApplyObj.isMainSku=isMainSkuArr[j];
                    planingApplyList.push(planingApplyObj);
                }
            }
            formData.planingApplyList=planingApplyList;
            //活动基础信息
            var planingInfo={};
            planingInfo.planingCode=$("#planingCode").val();//活动编号
            planingInfo.advertising="";//
            var isPromotions=$("#promotionType").val();
            if(isPromotions){
                if($("#limitPin").is(':checked')){
                    planingInfo.limitPin=1; //是否限pin 1限，0不限
                }else{
                    planingInfo.limitPin=0; //是否限pin 1限，0不限
                }
                if($("#limitDevice").is(':checked')){
                    planingInfo.limitDevice=1; //是否限设备，1限，0不限；
                }else{
                    planingInfo.limitDevice=0; //是否限设备，1限，0不限；
                }
                planingInfo.limitCount=$("#limitCount").val(); //限购数量
            }
            planingInfo.floorCode= $("#floorCode").val();//楼层编号
            planingInfo.floorGroupCode=$("#floorGroupCode").val();//楼层组编号
            planingInfo.promotionType=isPromotions;

            //转换成JSON
            formData.planingInfo=planingInfo;
            var ajaxData= JSON.stringify(formData);


            dialog.openUrlContent({
                id: "planningApplyEnter",
                title : "确认提交",
                btnTxt:["确 定"],
                url : webRootPath + "/planingApplyEnter/enter?formData="+ajaxData,
                width: 780,
                height: 400,
                callback:[function(){
                    window.location.href= webRootPath + "/planning/actInvite";
                }]
            });
            $("#dialogplanningApplyEnter").find(".close").remove();
        });
        //门店信息
        elem.stationInfo.die().live("click",function(){
            dialog.openUrlContent({
                id: "stationInfoPop",
                title : "查询门店",
                url : webRootPath + "/planingApplyEnter/searchStoreInfo?stations="+stationCodeArr.join(","),
                width: 780,
                height: 400
            });
        });
    }

    //初始化
    function pageLoad () {
        validate.init();
        form.init(pageid);
        form.searchQuery(pageid);
        //实例化分页控件
        pageTemplet1 = pageMod.init({
            render: $("#creatStep_3 .footer"),
            rows: rows,
            callback: function (page) {
                creatList(page);
            }
        });
    }
    //构建提交页面
    function creatTitle(){
        var trHtml="";
        var isPromotions=$("#promotionType").val();
        trHtml+='<tr>'
            +'<th>门店信息 </th>'
            +'<th>京东商品编码</th>'
            +'<th>商品名称</th>'
            +'<th>到家价</th>';
        if(isPromotions.length>0){
            trHtml+='<th data-main="11111">促销价</th>'
        }
        trHtml+='</tr>';
        $("#creatStep_3 table thead").html(trHtml);
    }
    //构建提交页面
    function creatList(page){
        var trHtml="";
        var maxTr= rows>skuIdArr.length?skuIdArr.length:rows;
        var isPromotions=$("#promotionType").val();
        for(var i=0;i<maxTr;i++){
            var pageNo = (page-1)*10+i;
            trHtml+='<tr>'
                  +'<td><a class="enrolAct" href="javascript:void(0);">'+stationCodeArr.length+'个</a></td>'
                  +'<td>'+skuIdArr[pageNo]+'</td>';
//            if(isMainSkuArr==1){
//                trHtml+=+'<td>'+skuNameArr[pageNo]+'</td>'
//            }else{
//                trHtml+=+'<td>'+skuNameArr[pageNo]+'<span class="blue">[备]</span></td>'
//            }
            trHtml+='<td>'+skuNameArr[pageNo]+'</td>'
                  +'<td>'+stationPriceArr[pageNo]+'</td>';
            if(isPromotions.length>0){
                trHtml+='<td>'+promotionPriceArr[pageNo]+'</td>';
            }
            trHtml+='</tr>';
        }
        $("#creatStep_3 table tbody").html(trHtml);
    }

});