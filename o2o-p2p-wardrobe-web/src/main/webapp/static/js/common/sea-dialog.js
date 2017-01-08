/**
 * 弹出框组件
 * User: wulewei
 * Date: 15-5-25
 */
/**
 * 弹出框组件 --增加按钮自定义名称及样式的功能
 * User: yaofengjiao
 * Date: 16-5-12
 */
define(function (require, exports) {

    /**
     * jquery
     * 获取包装后对象和方法
     */
    var $ = require("jquery");


    /**
     * 弹出对话框底层方法
     * @param paramsObj
     * title 标题
     * content 弹出层内容：来源取决于type
     * type 类型两位数字
     * 第一位标识content取值：1 直接显示content内容 ，2 content内容为url，3 content内容为url并放在frame中，4 制定ID内容
     * 第二位标识取值：1生成确认和取消按钮 ，2生成关闭按钮
     * width
     * height
     * callback 按钮回调函数
     */
    function open(params) {
        if (!params.title) params.title = "信息";
        buildDialog(initOpenParam(params));
    };


    /**
     * 初始化弹出框入参
     * @param params
     * @returns {{id: *, title: *, content: *, type: *, width: *, height: *, callback: (*|callback|g._listeners.callback), isClose: boolean}}
     */
    function initOpenParam(params) {
        var params = typeof(params) == 'object' ? params : {};
        var obj = {
            id: params.id ? params.id : new Date().getTime(),
            title: params.title ? params.title : "提示",
            content: params.content ? params.content : "还没有内容！",
            type: params.type ? params.type : "12",
            width: params.width,
            height: params.height,
            target: params.target || $("body"),
            callback: params.callback,
//            btnTxt : params.btnTxt || "确定"
            btnTxt :  params.btnTxt,
            btnClass :  params.btnClass   //按钮样式
        };
        return obj;
    }


    /**
     * 生成弹出框内容并绑定事件
     * @param paramsObj
     * @returns {html string}
     */
    var maskSize = 0;
    function buildDialog(paramsObj) {
        var type = Math.floor(paramsObj.type.charAt(0));
        switch (type) {
            case 1: buildContent(paramsObj); break;
            case 2: buildContentByUrl(paramsObj); break;
            case 3: buildFrameByUrl(paramsObj); break;
            case 4: buildContentById(paramsObj); break;
            default:;
        }
        if(!maskSize){
            paramsObj.target.append('<div class="dialog-mask" onSelectStart="return false"></div>');
            maskSize = 1;
        }
        $(".dialog-mask").show();
    }


    /**
     * 当前页面弹出层，内容为paramsObj.content
     * @param paramsObj
     */
    function buildContent(paramsObj){
        var containerHtml = buildCommonContent(paramsObj);
        paramsObj.target.append(containerHtml);
        dialogSetting(paramsObj.id);
    }


    /**
     * 当前页面弹出层，内容为指定url异步获取
     * @param paramsObj
     */
    function buildContentByUrl(paramsObj) {
        var containerHtml,url,dialogId;
        url = paramsObj.content;
        dialogId = "dialog" + paramsObj.id;
        paramsObj.content = "<span>数据加载中...</span>";
        containerHtml = buildCommonContent(paramsObj);
        paramsObj.target.append(containerHtml);
        $.ajax({
            url: url,
            cache: false,
            success: function (result) {
                if (result && result.result && result.result.retMsg) {
                    paramsObj.content = result.result.retMsg;
                } else {
                    paramsObj.content = result;
                }
            },
            error: function (xhr, error) {
                paramsObj.content = "请求出现错误" + error;
            },
            complete : function (xhr,ts) {
                $("#" + dialogId).find(".dialog-content").html(paramsObj.content);
                dialogSetting(paramsObj.id);
            }
        });
    }


    /**
     * 当前页面弹出层，内容为指定url异步获取
     * @param paramsObj
     */
    function buildFrameByUrl(paramsObj) {
        var containerHtml,url;
        url = paramsObj.content;
        paramsObj.content = '';
        paramsObj.content += '<iframe align="middle" marginwidth="0" marginheight="0" frameborder="no"';
        paramsObj.content += 'width="100%" height="100%" src="';
        paramsObj.content += url;
        paramsObj.content += '"></iframe>';
        containerHtml = buildCommonContent(paramsObj);
        paramsObj.target.append(containerHtml);
        dialogSetting(paramsObj.id);
    }


    /**
     * 当前页面弹出层，内容为指定id下内容
     * @param paramsObj
     */
    function buildContentById(paramsObj) {
        var containerHtml = "";
        var content = $("#" + paramsObj.content);
        paramsObj.content = content;
        containerHtml = buildCommonContent(paramsObj);
        paramsObj.target.append(containerHtml);
        dialogSetting(paramsObj.id);
    }


    /**
     * 构建弹出层基础架构
     * @param paramsObj
     */
    function buildCommonContent(paramsObj) {
        var mainarr = [],
            id = paramsObj.id,
            width = paramsObj.width ? Math.floor(paramsObj.width) : 300,
            height = paramsObj.height ? paramsObj.height  : 240,
            left = ($(window).width() - width - 20) / 2 > 10 ? ($(window).width() - width - 20) / 2 : 10,
            top = ($(window).height() - height - 140) / 2 > 10 ? ($(window).height() - height - 140) / 2 : 10,
            dataParams = 'data-left="' + left + '" data-top="' + top + '" ',
            contentStyle = 'width:' + width + 'px; height:' + height + 'px;',
            operateType = paramsObj.type.charAt(1),
            dialogId = 'dialog' + id,
            confirmId = 'confirm' + id,
            cancelId = 'cancel' + id,
            ctop = top - 50 > 0 ? top - 50 : 0;
        mainarr.push('<div class="dialog" id="' + dialogId + '" ' + dataParams + ' style="left:' + left + 'px;');
        mainarr.push(' top:' + ctop + 'px;">');
        mainarr.push('<h2><span class="dialog-title">' + paramsObj.title + '</span><a href="#@" class="close iconfont">&#xf00b3;</a></h2>');
        mainarr.push('<div class="dialog-content" style="' + contentStyle + '">');
        mainarr.push(paramsObj.content);
        mainarr.push('</div>');
        if (operateType == 1) {
            mainarr.push('<div class="dialog-foot">');
//            if (paramsObj.callback) mainarr.push('<button id="' + confirmId + '" class="button bg-blue mr10">'+paramsObj.btnTxt+'</button>');
//            if (paramsObj.callback) {
//                mainarr.push('<button id="' + cancelId + '" class="button bg mr10">取 消</button></div>');
//            } else {
//                mainarr.push('<button id="' + cancelId + '" class="button bg mr10">关 闭</button></div>');
//            }
            if (typeof(paramsObj.btnTxt)=="object" && paramsObj.btnTxt[0].length!=0) {   //自定义多个按钮
                for(var i=0;i<paramsObj.callback.length;i++){
                    if(paramsObj.btnTxt[i].length>0){
                        if(typeof(paramsObj.btnClass)!="undefined"){
                            mainarr.push('<button class="button '+paramsObj.btnClass[i]+' mr10 ' + confirmId + '">'+paramsObj.btnTxt[i]+'</button>');
                        }else{
                            mainarr.push('<button class="button bg-blue mr10 ' + confirmId + '">'+paramsObj.btnTxt[i]+'</button>');
                        }
                    }
                }
            }else if(typeof(paramsObj.btnTxt)=="string" &&  paramsObj.btnTxt.length!=0){ //自定义一个按钮
                if(typeof(paramsObj.btnClass)!="undefined"){
                    mainarr.push('<button class="button '+paramsObj.btnClass+' mr10 ' + confirmId + '">'+paramsObj.btnTxt[i]+'</button>');
                }else{
                    mainarr.push('<button id="' + confirmId + '" class="button bg-blue mr10">'+paramsObj.btnTxt+'</button>');
                }
            }else if((typeof(paramsObj.btnTxt)=="string" &&  paramsObj.btnTxt.length==0)||(typeof(paramsObj.btnTxt)=="object" && paramsObj.btnTxt[0].length==0)){//无按钮的情况  --btnTxt："" 的情况 或btnTxt：[""]
                //Nothing
            }else if (typeof(paramsObj.btnTxt)=="undefined") {   //默认的“确定”“取消”按钮
                mainarr.push('<button id="' + confirmId + '" class="button bg-blue mr10">确 定</button>');
                mainarr.push('<button id="' + cancelId + '" class="button bg mr10">取 消</button></div>');
            } else if(!paramsObj.callback){
                mainarr.push('<button id="' + cancelId + '" class="button bg mr10">关 闭</button></div>');
            }
        } else if (operateType == 2) {
            mainarr.push('<div class="dialog-foot">');
            mainarr.push('<button id="' + cancelId + '" class="button bg mr10">关 闭</button></div>');
        } else if(operateType == 3){
        }
        mainarr.push('</div>');


        $("." + confirmId).die().live("click", function () {
            var btnIndex = $("." + confirmId).index(this);
            if (paramsObj.callback) {
                if (paramsObj.type.charAt(2)) {
                    var textarea = $(this).parents(".dialog").find("textarea").val();
                    paramsObj.callback(dialogId, textarea);
                } else {
                    paramsObj.callback[btnIndex](dialogId);
                }
            }
        })

        $("#" + confirmId).die().live("click", function () {
            if (paramsObj.callback) {
                if (paramsObj.type.charAt(2)) {
                    var textarea = $(this).parents(".dialog").find("textarea").val();
                    paramsObj.callback(dialogId, textarea);
                } else {
                    paramsObj.callback(dialogId);
                }
            }
        })
        $("#" + cancelId).die().live("click", function () {
            exports.close(dialogId);
        });
        $("#dialog" + id).find(".close").die().live("click", function () {
            exports.close(dialogId);
            return false;
        });
        return mainarr.join("");
    }


    /**
     * 设置弹窗展现
     * @param id
     */
    function dialogSetting(id) {
        $("body").css("overflow","hidden");
        var dialogObj = $("#dialog" + id);
        var t = dialogObj.attr("data-top");
        var l = dialogObj.attr("data-left");
        dialogObj.removeAttr("data-top");
        dialogObj.removeAttr("data-left");
        dialogObj.show().stop().animate({top:t, left:l} , 300);
    }


    /***********************************************************************
     * 下面方法为调用层
     * confirm 询问层
     * openUrl 引入url内容
     * openFrame 引入url内容到iframe(外部系统调用，内部带交互不要使用此方法)
     */


    /**
     * 关闭弹出框
     * @param id 弹出框id;
     */
    exports.close = function (id, callback) {
        $("#" + id).remove();
        if (!$(".dialog").size()) $(".dialog-mask").hide();
        if (callback)  callback();
        $("body").removeAttr("style");
    };


    /**
     * 提示框
     * @param id 内容
     * @param callback 确认回调函数
     */
    exports.loading = function () {
        var params = {};
        params.title = "提示";
        params.type = "12";
        params.content = content;
        params.width = "300";
        open(params);
    };


    /**
     * 基本
     * @param content 内容
     * @param callback 确认回调函数
     */
    exports.alert = function (content,target) {
        var params = {};
        params.title = "提示";
        params.type = "12";
        params.content = content;
        params.width = "220";
        params.height = "40";
        if (target) params.target = target;
        open(params);
    };

    /**
     * 基本2
     * @param content 内容
     * @param callback 确认回调函数
     */
    exports.openContent = function (content, target) {
        var params = {};
        params.title = "提示";
        params.type = "11";
        params.content = content;
        console.log(content);
        params.width = "520";
        params.height = "240";
        if (target) params.target = target;
        open(params);
    };


    /**
     * 提示框
     * @param content 辅助文字
     * @param callback 确认回调函数
     */
    exports.prompt = function (content,callback,target) {
        var params = {};
        var textarea = '<textarea rows="5" cols="40" class="mt10"></textarea>';
        params.title = "提示";
        params.type = "111";
        params.content = content;
        params.width = "300";
        if (typeof params.content === "function") {
            params.callback = params.content;
            params.content = textarea;
        } else {
            params.content = '<p>' + content +'</p>' + textarea;
            params.callback = callback;
        }
        if (target) params.target = target;
        open(params);
    };


    /**
     * 询问层确认层
     * @param content 内容
     * @param callback 确认回调函数
     */
    exports.confirm = function (content, callback ,target) {
        var params = {};
        params.title = "提示";
        params.type = "11";
        params.content = content;
        params.width = "240";
        params.height = "100";
        if (arguments.length == 3) {
            if ( typeof callback === "function") {
                params.callback = callback;
                params.target = target;
            } else {
                params.callback = target;
                params.target = callback;
            }
        } else if (typeof callback === "function") {
            params.callback = callback;
        } else {
            params.target = callback;
        }
        open(params);
    };


    /**
     * 请求URL内容
     * @param title 标题
     * @param callback 确认回调函数
     * @param target 插入目标位置
     */
    exports.openUrlContent = function (params) {
        params.content = params.url;
        params.target = params.target;
        params.type = "21";
        params.url = null;
        open(params);
    };

    /**
     * 请求URL内容
     * @param title 标题
     * @param callback 确认回调函数
     * @param target 插入目标位置
     */
    exports.openUrlContentNoBtn = function (params) {
        params.content = params.url;
        params.target = params.target;
        params.type = "23";
        params.url = null;
        open(params);
    };

    /**
     * 引入iframe
     * @param title 标题
     * @param url 请求地址
     * @param callback 确认回调函数
     */
    exports.openFrameContent = function (params) {
        params.content = params.url;
        params.target = params.target;
        params.type = "31";
        params.url = null;
        open(params);
    };
    exports.openFrameContentNoBtn = function (params) {
        params.content = params.url;
        params.target = params.target;
        params.type = "33";
        params.url = null;
        open(params);
    };


    /**
     * 引入Id内容
     * @param title 标题
     * @param id 请求地址
     * @param callback 确认回调函数
     */
    exports.openIdContent  = function (params) {
        params.content = params.id;
        params.target = params.target;
        params.type = "41";
        params.id = null;
        open(params);
    };


    /**
     * 弹出框可拖拽
     */
    $("body").on("mousedown",".dialog h2",function(ev){
        var ev,dialog,dashedBox,oldX,oldY,nowX,nowY,oW,oH;
        ev = ev || window.event;
        dialog = $(this).parent();
        var oTarget = ev.srcElement || ev.target;
        if (oTarget.tagName == "A") return false;
        if (dialog.offset().left <= 10) return false;
        if (dialog.offset().top <= 10) return false;
        oW = dialog.width();
        oH = dialog.height();
        dashedBox = $('<div class="dialog-dashed"></div>')
        oldX = ev.clientX - dialog.offset().left;
        oldY = ev.clientY - (dialog.offset().top - $(window).scrollTop());
        dialog.parent().append(dashedBox);

        $(document).unbind("mousemove").bind("mousemove", function(ev){
            if (ev.clientX < 20 || ev.clientX > $(window).width() - 20 || ev.clientY < 20 || ev.clientY > $(window).height() - 20) {
                $(document).unbind("mousemove");
                $(document).unbind("mouseup");
                dashedBox.remove();
            }
            nowX = ev.clientX - oldX;
            nowY = ev.clientY - oldY;
            if (nowX < 10) nowX = 10;
            if (nowY < 10) nowY = 10;
            if (nowX > $(window).width() - oW - 10) nowX = $(window).width() - oW - 10;
            if (nowY > $(window).height() - oH  - 10) nowY = $(window).height() - oH - 10;
            dashedBox.css({
                width: oW,
                height: oH,
                left: nowX,
                top: nowY
            });
            return false;
        });

        $(document).unbind("mouseup").bind("mouseup", function(ev){
            $(document).unbind("mousemove");
            $(document).unbind("mouseup");
            dashedBox.remove();
            dialog.css({"left":nowX, "top":nowY});
        });
        return false;
    });

});