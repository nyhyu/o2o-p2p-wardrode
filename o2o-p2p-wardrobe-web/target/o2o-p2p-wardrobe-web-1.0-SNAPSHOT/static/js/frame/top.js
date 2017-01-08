window.onload = function () {
    document.getElementById("logout").onclick = function (e) {
        var ev = e || window.event;
        ev.preventDefault();
        top.location.href = "/logout";
    };

    var parent = window.parent;
    parent.document.getElementById("frameCenter").onload = function () {
        var contentFrame = this.contentWindow.document.getElementById("frameMain");
        document.getElementById("revise").onclick = function () {
            contentFrame.src = "http://login.o2o.jd.com/user/changePwd??backUrl=http://shop.o2o.jd.com/sso/success&appCode=lsp-store&orgCode=123456";
        };
    }
}