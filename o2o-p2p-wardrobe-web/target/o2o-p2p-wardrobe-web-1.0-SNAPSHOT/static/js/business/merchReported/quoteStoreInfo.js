/**
 * hello
 * User: yaofengjiao
 * Date: 16-05-16
 */
define(function(require,exports){
    var $ = require('jquery');
//    var dialog = require('dialog');
//    var util = require('util');
//    var form = require('form');
    var pageMod = require('/static/js/common/sea-page.js');
    var completeMod = require('/static/js/business/merchReported/complete.js');
   // var elem = {};
//    var pageid = "dashboard";



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
    });

    //获取页面基础元素
    function getElem () {
        //绑定外层元素对象
        //elem.pageObj = util.paramJquery(pageid);
    }

    //绑定事件
    function bindEvent () {

    }

    //初始化
    function pageLoad () {
//        form.init(pageid);
        //实例化分页控件
        pageTemplet1 = pageMod.init({
            render: $("#storeInfo .footer"),
            rows: rows,
            callback: function (page) {
                //loadGridData(page);
                creatList(page);
            }
        });
        creatList(1);
        pageTemplet1.refresh(1, completeMod.stationCodeArr.length);
    }

    //构建提交页面
    function creatList(page){
        var trHtml="";
        var maxTr= rows>completeMod.stationCodeArr.length?completeMod.stationCodeArr.length:rows;
        for(var i=0;i<maxTr;i++){
            var pageNo = (page-1)*10+i;
            trHtml+='<tr>'
                  +'<td>'+completeMod.stationCodeArr[pageNo]+'</td>'
                  +'<td>'+completeMod.stationNameArr[pageNo]+'</td>'
                  +'</tr>';
        }
        $("#storeInfo table tbody").html(trHtml);
    }

});