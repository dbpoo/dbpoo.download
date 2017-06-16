function Download(options) {
    var p = $.extend({}, Download.defaults, options);
    this.game = p.game.trim();
    this.ios = p.ios.trim();
    this.android = p.android.trim();

    this.init();
}

Download.prototype.init = function() {
    var that = this, txt = '', type = '';
    var url = that.parseURL(window.location.href);
    var pcType = url.params.type;
    var urlRegex = /^((http|https):\/\/)/;

    if(Device.os.phone) {
        $('.backbtn a').attr('href','http://'+ that.game +'.ledo.com/m');
    } else {
        $('.backbtn a').attr('href','http://'+ that.game +'.ledo.com/');
    }

    if(typeof pcType === 'undefined' && !Device.os.phone) {
        type = 'android';
    }

    if(Device.os.ios || pcType == 'ios') {
        type = 'ios';
    }

    if(Device.os.android || pcType == 'android') {
        type = 'android';
    }

    if(Device.os.weixin) {
        type = 'wx';
        if(Device.os.ios && !urlRegex.test(that.ios.toLowerCase())){
            type = 'ios'
        }
        if(Device.os.android && !urlRegex.test(that.android.toLowerCase())){
            type = 'android'
        }
    }

    switch (type) {
        case 'ios' :
            if(urlRegex.test(that.ios.toLowerCase())) {
                that.open(that.ios);
            } else {
                if(that.ios == ''){
                    alert(Download.defaults.ios);
                } else {
                    alert(that.ios);
                }

                that.back();
            }
            break;
        case 'android' :
            if(urlRegex.test(that.android.toLowerCase())) {
                that.open(that.android);
            } else {
                if(that.android == ''){
                    alert(Download.defaults.android);
                } else {
                    alert(that.android);
                }

                that.back();
            }
            break;
        case 'wx' :
            $('.backbtn').hide();
            $("body").addClass("wxdonwload");
            break;
        default :
            that.back();
            break;
    }
};

Download.prototype.parseURL = function(url) {
    var a =  document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function(){
            var ret = {},
                seg = a.search.replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: a.pathname.replace(/^([^\/])/,'/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
};

Download.prototype.open = function(url) {
    setTimeout(function(){
        window.location.href = url;
    },500);
};

Download.prototype.back = function() {
    var that = this;
    if(Device.os.phone) {
        that.open('http://'+ that.game +'.ledo.com/m/')
    } else {
        that.open('http://'+ that.game +'.ledo.com/')
    }
};

Download.defaults = {
    game   : '',
    ios    : 'iOS版本测试暂未开放，敬请期待！',
    android: 'Android版本测试暂未开放，敬请期待！'
};