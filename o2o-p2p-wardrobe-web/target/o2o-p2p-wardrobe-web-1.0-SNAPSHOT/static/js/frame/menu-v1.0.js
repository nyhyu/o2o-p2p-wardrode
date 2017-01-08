(function ($ns) {
    $ns.changeNum = 0;
    $ns.changeArr = ["menu-default", "menu-layer"];
    $ns.changeLen = $ns.changeArr.length;

    $ns.init = function (menu) {
        this.menu = menu;
        this.main = this.menu.next();
        this.tit = menu.find("a");
        $ns.change();
    };

    $ns.change = function () {
        $ns.refres();
        this.menu.attr("class", $ns.changeArr[$ns.changeNum]);
        switch ($ns.changeArr[$ns.changeNum]) {
            case "menu-default" : $ns.fold(); break;
            case "menu-layer" :  $ns.layer(); break;
        }
        $ns.changeNum++;
        $ns.changeNum = $ns.changeNum % $ns.changeLen;
    };

    $ns.refres = function () {
        this.tit.unbind("click");
        this.tit.unbind("mouseenter");
        this.tit.parent().unbind("mouseleave");
        this.tit.removeClass("active");
        this.tit.parent().find("ul").removeAttr("style");
    };

    $ns.fold = function () {
        this.main.css("padding-left", "184px");
        this.tit.unbind("click").bind("click", function () {
            var lev, child, size, oneH;
            lev = $(this).next();
            child = lev.children(".menu-list");
            size = child.size();
            oneH = child.eq(0).height();
            if (size && lev.height() == 0) {
                var ch = oneH * size;
                lev.stop().animate({"height": ch}, "fast", function () {
                    var thisParentUL = lev.parent().parent();
                    if (thisParentUL.attr("id") != "menu"){
                        var oldH = thisParentUL.height();
                        thisParentUL.css("height", "auto");
                        var ch = thisParentUL.height();
                        thisParentUL.css("height", oldH);
                        thisParentUL.animate({"height": ch}, function () {
                            thisParentUL.css("height", "auto");
                        });
                    }
//                    if (1 == 0) {
//                        var siblingsSize = lev.parent().siblings().size() + 1;
//                        var siblingsHeight = lev.parent().siblings().eq(0).height();
//                        var h = siblingsSize * siblingsHeight + ch;
//                        thisParentUL.prev().addClass("active");
//                        thisParentUL.animate({"height": h}, function () {
//                            thisParentUL.css("height", "auto");
//                        });
//                    }
                });
                $(this).addClass("active");
                $(this).parent().siblings().find("a").removeClass("active");
                $(this).parent().siblings().find("ul").animate({"height": 0}, "fast");
            } else {
                lev.stop().animate({"height": 0}, "fast", function () {
                    lev.prev().removeClass("active");
                    lev.find("ul").height(0);
                });
            }
        });
    };

    $ns.layer = function () {
        this.main.css("padding-left", "49px");
        this.tit.each(function () {
            if ($(this).hasClass("menu-tit1")) {
                var lev = $(this).next();
                $(this).unbind("mouseenter").bind("mouseenter", function () {
                    var _this = this;
                    $ns.timer = setTimeout(function () {
                        $(_this).addClass("active");
                        lev.show().parent().siblings().find(".menu-lev1").hide();
                        var h = lev.height(),
                            t = lev.offset().top;
                        if (h + t > lsp.getCh() && h < lsp.getCh()) {
                            lev.css("top", lsp.getCh() - (h + t + 10));
                        } else if (h > lsp.getCh()) {
                            lev.css("top", -t);
                        }
                        lev.show();
                    }, 200);
                });
                $(this).parent().unbind("mouseleave").bind("mouseleave", function () {
                    clearTimeout($ns.timer);
                    $(this).find(".menu-tit1").removeClass("active");
                    lev.css("top", "0").hide();
                });
            }
        });
    };

})(using("Menu"));


(function ($ns) {
    $ns.bindEvent = function () {
        var obj = $("#shortcut"),
            lev = obj.next(),
            contentObj = $("#shortcutWrap"),
            content = contentObj.html(),
            width = contentObj.find(".shortcut-menu").width() + 20,
            height = contentObj.find(".shortcut-menu").height() > 500 ? 500 : contentObj.find(".shortcut-menu").height(),
            resIds = [];

        obj.removeClass("active");
        if (Menu.changeArr[Menu.changeNum] == "menu-layer") {
            lev.stop().animate({"height": "0"});
        }
        lsp.openContentByObject({
            id: "shortcuPop",
            title: "设置快捷菜单 （最多5个）",
            width: width,
            height: height,
            content: content,
            callback: function (data) {
                var checkBox = $("#shortcuPop").find("input:checkbox:checked");
                var size = checkBox.size();
                if (size > 5) {
                    var tipsHTML = '<span id="errorMsg" style="padding-right:15px;color:#F00;">最多设置5个快捷菜单!</span>';
                    $("#shortcuPop .dialog-foot").find("#errorMsg").remove();
                    $(tipsHTML).insertBefore($("#shortcuPop .dialog-foot button").eq(0));
                    return;
                }
                lsp.ajaxPostAsync("/saveShortcut", checkBox.serialize(), function (result) {
                    var result = result.status.result;
                    lsp.unLoading(data);
                    if (result == "success") {
                        lsp.alert("保存成功！");
                        $("#shortcut").next().find(".menu-list").remove();
                        checkBox.each(function () {
                            var id = $(this).val();
                            $("#shortcut").next().append($("#lev" + id).parent().clone());
                            resIds.push(id);
                        });
                        contentObj.find("input[type='checkbox']").removeAttr("checked");
                        for (var i = 0; i < resIds.length; i++) {
                            contentObj.find("input[value='" + resIds[i] + "']")[0].setAttribute("checked", "checked");
                        }
                    } else {
                        lsp.alert("保存失败！");
                    }
                });
            }
        });
    };
})(using("MenuSortcut"));


$(function () {
    var topFarme = window.parent.document.getElementById("frameTop");
    var transform = topFarme.contentWindow.document.getElementById("menuTransform");
    var $menu = $("#menu");

    Menu.init($menu);
    $(transform).bind("click", function () {
        if ($(this).hasClass("menu-def")){
            $(this).removeClass("menu-def").addClass("menu-layer");
        }else {
            $(this).removeClass("menu-layer").addClass("menu-def");
        }
        Menu.change();
    });

    $("#shortcut img,.setting").click(function (ev) {
        MenuSortcut.bindEvent(ev);
        ev.stopPropagation();
    });

});


