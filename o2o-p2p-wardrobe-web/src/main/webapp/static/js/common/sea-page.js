define(function (require, exports) {
	var $ = require("jquery");
	var util = require("util");

	// 创建分页
	exports.init = function (opts) {
		return new Page(opts);
	}

	function Page (opts) {
		this.$render = util.paramJquery(opts.render);
		this.rn = opts.rows;
		this.callback = opts.callback;
		this.init();
	}

	Page.prototype = {
		init : function () {
			this.createTemplate();
			this.bindEvent();
		},

		createTemplate : function () {
            var total = this.total ? Math.ceil(this.total / this.rn) : 0;
            var pn = Math.floor(this.pn);
            if (total < 1) return;
			var pageHtml = [];
			if (pn != 1) {
				pageHtml.push('<a hidefocus href="javascript:;">上一页</a>');
			} else {
				pageHtml.push('<a hidefocus href="javascript:;" class="disabled">上一页</a>');
			}
			pageHtml.push('<a hidefocus href="javascript:;" ');
			pageHtml.push(pn == 1 ? 'class="current"' : 'class=""');
			pageHtml.push('>1</a>');
			if (pn > 4) {
			pageHtml.push('<span class="point">...</span>');
			}
			var startNum = pn >= 4 ? (pn - 2) : 2;
			var endNum = pn + 2 >= total ? total - 1 : pn + 2;
			for (var i = startNum; i <= endNum; i++) {
				if (pn == i) {
					pageHtml.push('<a hidefocus href="javascript:;" class="current">' + i + '</a>');
				} else {
					pageHtml.push('<a hidefocus href="javascript:;" class="">' + i + '</a>');
				}
			}
			if (pn + 3 < total) {
			pageHtml.push('<span class="point">...</span>');
			}
			if (total != 1) {
			pageHtml.push('<a hidefocus href="javascript:;" ');
			pageHtml.push(pn == total ? 'class="current">' : 'class="">');
			pageHtml.push(total);
			pageHtml.push('</a>');
			}
			if (pn != total){
				pageHtml.push('<a hidefocus href="javascript:;">下一页</a>');
			} else {
				pageHtml.push('<a hidefocus href="javascript:;" class="disabled">下一页</a>');
			}
			this.$render.html('<div class="page style-red">' + pageHtml.join("") + '</div>');
		},

		bindEvent : function () {
			var self = this;
			var $pageWrap = this.$render.find(".page");
            var total = this.total ? Math.ceil(this.total / this.rn) : 0;
			$pageWrap.find("a").die().live("click", function () {
				if (!$(this).hasClass("disabled")) {
                    $("body").find(".current").removeClass("current");
                    $(this).addClass("current");
					var pn = $(this).text();
                    if(pn != 1){
                        $pageWrap.find("a").eq(0).removeClass("disabled");
                    }else{
                        $pageWrap.find("a").eq(0).addClass("disabled");
                    }
                    if(pn != total){
                        $pageWrap.find("a").eq(total+1).removeClass("disabled");
                    }else{
                        $pageWrap.find("a").eq(total+1).addClass("disabled");
                    }
					if (pn == "上一页") pn = self.pn - 1;
					if (pn == "下一页") pn = Math.floor(self.pn) + 1;
					self.callback.call(self, pn);
				}
			});
		},

        getCurPage : function () {
             return this.pn;
        },

		refresh : function (pn, total) {
			this.pn = pn;
			if (total || total == 0) this.total = total;
			this.createTemplate();
		}
	}
});