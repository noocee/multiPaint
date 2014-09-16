$(function() {
    if (self != top) {
        if (getParamValue('wall') == 1) {
            sharego();
            setTimeout(function() {
                var tmp_w = $(window).width() - 5;
                $('#qrcode').empty().qrcode({width: tmp_w, height: tmp_w, correctLevel: 1, text: window.location.href}).css({marginTop: '30%'});
                $('#sharefq img').hide();
                $('.tools').hide()
            }, 200)
        }
    }
    $('#qrcode').qrcode({correctLevel: 0, text: window.location.href});
    colorpicker_fbs = $.farbtastic('#colorpicker')
});

var colorpicker_fbs;
function ste_colorpicker(hascl) {
    colorpicker_fbs.setColor(hascl);
    fbsshowcolor(hascl);
    colorpicker_fbs.linkTo(fbsshowcolor);
    function fbsshowcolor(color) {
        $('#colorbutton').css('background', color);
        $('#colorbutton').attr('onclick', "set_yscx('" + color + "');$('#fk_container').hide();")
    }
    $('#fk_container').show()
}

var myName = '设置你的名字';

function sharego() {
    $('#sharefq').show()
}

function creatroom(act) {

    if (act) {
        $('#actionfk1').hide();
        $('#actionfk2').show()
    } else {
        var nowtime = new Date().getTime();
        var $myurl = window.location.origin + window.location.pathname + '?opt=' + nowtime;
        console.log('creatroom ............');
        console.log($myurl)
        window.location.href = $myurl
    }
}

function joinroom(id) {
    var id = $('#number').val();
    if (id) {
        var $myurl = window.location.origin + window.location.pathname + '?opt=' + id;
        window.location.href = $myurl
    } else {
        creatroom()
    }
}

function set_yscx(ys, cx, obj) {
    if (ys) {
        yanse = ys;
        $('#colorpickerbnt').css('background', yanse)
    }
    if (cx) {
        cuxi = cx;
        var xpcem = $('.t_bitou').find("bottom[title='橡皮擦']");
        if ($(xpcem).hasClass('active')) {
            cuxi = -cuxi
        }
    }
    $('#bitou').css({width: cuxi, height: cuxi, background: yanse});
    if (obj) {
        $(obj).siblings().removeClass('active');
        $(obj).addClass('active')
    }
}

function set_bitou(act, obj) {
    if (act == 1) {
        cuxi = Math.abs(cuxi);
        $('.t_yanse').show()
    } else if (act == 2) {
        cuxi = -cuxi;
        $('.t_yanse').hide()
    } else if (act == 3) {
        if (confirm("你确信要清空画板吗？\n这样做会清空此画板上所有人的涂鸦！\n确定要这样吗？")) {
            drawP(0, 0, 0, 0, 1);
            cuxi = Math.abs(cuxi);
            $(obj).siblings().removeClass('active');
            $(obj).siblings().first().addClass('active')
        }
        $(obj).removeClass('active');
        return
    } else {
        alert('保存成功!')
    }
    $(obj).siblings().removeClass('active');
    $(obj).addClass('active')
}

function showlist(data) {
    var count = 0, htmlstr = '', cname = '';
    $('#userlist').empty();
    htmlstr = ' <li><a href="javascript:;" onclick="setname();"><span class="glyphicon glyphicon-user"></span>' + myName + '</a></li>';
    htmlstr += '<li><a href="javascript:;" onclick="sendsay();">给大家发消息<span class="glyphicon glyphicon-send"></span></a></li><li class="divider"></li>';
    $('#userlist').append(htmlstr);
    console.log(data);console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^')
    $.each(data, function(index, val) {
        console.log(val)
        count += 1;
        if (val.cname) {
            cname = val.cname
        } else {
            cname = index
        }
        htmlstr = ' <li id="' + index + '"><a href="javascript:;" title="' + val.ip + '" onclick="sendsay(\'' + index + '\')">' + cname + '</a></li>';
        $('#userlist').append(htmlstr)
    });
    htmlstr = '<li class="divider"></li><li><a href="javascript:;" onclick="sharego();"><span class="glyphicon glyphicon-share"></span>分享给朋友</a></li>';
    $('#userlist').append(htmlstr);
    $('#nowinline').html('在线' + count + '人 <span class="caret"></span>');
    if (self != top) {
        if (getParamValue('wall') == 1) {
            if (count > 1) {
                $('#sharefq').hide()
            } else {
                $('#sharefq').show()
            }
        }
    }
}

function setname() {
    myName = prompt("请输入您的名字", "");
    if (myName) {
        socket.emit('setNickname', myName)
    } else {
        myName = '设置你的名字'
    }
    showlist(roomList)
}

function sendsay(uid) {
    var tmpname = '[大家]';
    if (uid) {
        tmpname = "(" + $('#' + uid + ' a').text() + ")"
    }
    var txt = prompt("请输入您要对" + tmpname + "说的话", "");
    if (txt) {
        socket.emit('say msgs', {id: uid, say: txt});
        var tmptou = '对[大家]说：';
        if (uid)
            tmptou = '悄悄对' + tmpname + '说：';
        say('(我)' + tmptou + txt)
    }
}

var meter1;
function say(txt) {
    clearTimeout(meter1);
    $('#msgbox p').html(txt).css({opacity: 0, marginTop: 40});
    $('#msgbox p').animate({opacity: 1, marginTop: 0}, {duration: 500, done: function() {
        meter1 = setTimeout(hidesay, 4000)
    }});
    function hidesay() {
        $('#msgbox p').animate({opacity: 0, marginTop: -40}, 1000)
    }
}

function getParamValue(name) {
    function getUrlParams() {
        var search = window.location.search;
        console.log('getParamValue window.location.search....................')
        console.log(search);
        var tmparray = search.substr(1, search.length).split("&");
        var paramsArray = new Array;
        if (tmparray != null) {
            for (var i = 0; i < tmparray.length; i++) {
                var reg = /[=|^==]/;
                var set1 = tmparray[i].replace(reg, '&');
                var tmpStr2 = set1.split('&');
                var array = new Array;
                array[tmpStr2[0]] = tmpStr2[1];
                paramsArray.push(array)
            }
        }
        return paramsArray
    }
    var paramsArray = getUrlParams();
    if (paramsArray != null) {
        for (var i = 0; i < paramsArray.length; i++) {
            for (var j in paramsArray[i]) {
                if (j == name) {
                    return paramsArray[i][j]
                }
            }
        }
    }
    return null
}

var opt = getParamValue('opt');
console.log('opt..........')
console.log(opt)
var yanse = '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
var cuxi = 10;
var socket, roomList = {};
var canvas, ctx;

$(function() {
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = $(window).width();
    canvas.height = $(window).height();
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    console.log(yanse)
    set_yscx(yanse);
    if (opt) {
        $('#actbox').hide();
        socket = io.connect('http://localhost:3000');
        console.log(opt);

        socket.emit('iJoin', {room: opt});

        socket.on('userIn', function(data) {
            if (data) {
                alert('userIn');
                console.log(data)
        //        socket.emit('shake hands', data.id);
                var tmpname = data.id;
                if (data.user)
                    tmpname = data.user.cname;
                say('(' + tmpname + ') [进入]');
            //    roomList[data.id] = data;
                showlist(data.members)
            }
        });

        socket.on('shake hands', function(data) {
            if (roomList[data.id]) {
                var tmpname = data.id;
                if (data.cname)
                    tmpname = $('#' + tmpname + ' a').text();
                say('(' + tmpname + ') 改名为 (' + data.cname + ')')
            }
            roomList[data.id] = data;
            showlist(roomList)
        });

        socket.on('userOut', function(data) {
            var tmpname = $('#' + data.id + ' a').text();
            delete roomList[data.id];
            say('(' + tmpname + ') [离开]');
            showlist(roomList)
        });

        socket.on('connect', function() {
            say('[与服务器连接成功]')
        });

        socket.on('draw', function(data) {
            return drawP(data.x, data.y, data.color, data.vsize, data.type, true, data.id, data.w)
        });

        socket.on('say msg', function(data) {
            var tmpname = $('#' + data.id + ' a').text();
            var tmptou = '对[大家]说：';
            if (data.to)
                tmptou = '悄悄对[你]说：';
            say('(' + tmpname + ')' + tmptou + data.txt)
        })
    }
});

var _isDown = false, lastPosition, lastPosition_S = {};
var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
var clickEvtName = device ? 'touchstart' : 'mousedown';
var moveEvtName = device ? 'touchmove' : 'mousemove';
var endEvtName = device ? 'touchend' : 'mouseup';
$(document).on(clickEvtName, '#myCanvas', mouseDownEvent);
$(document).on(moveEvtName, '#myCanvas', mouseMoveEvent);
$(document).on(endEvtName, '#myCanvas', mouseUpEvent);

function drawP(x, y, color, size, type, drawS, ID, canvasW) {
    if (!opt)
        return;
    var tmp = {room: opt, data: {x: x, y: y, color: color, vsize: size, type: type, w: canvas.width, h: canvas.height}};
    if (size < 0) {
        size = -size;
        ctx.globalCompositeOperation = "destination-out"
    } else if (size > 0) {
        ctx.globalCompositeOperation = "source-over"
    } else if (size == 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!drawS) {
            socket.emit('drawClick', tmp)
        }
        var name = '(您自己)';
        if (ID) {
            name = $('#' + ID + ' a').text()
        }
        say(name + "：[清空画布]");
        return
    }
    if (canvasW) {
        x = (x / canvasW) * canvas.width;
        y = (y / canvasW) * canvas.width;
        size = (size / canvasW) * canvas.width
    }
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.lineWidth = size;
    ctx.lineCap = ctx.lineJoin = 'round';
    if (drawS) {
        if (type == 1) {
            lastPosition_S[ID] = null;
            $('#' + ID + ' a').css('color', color)
        }
        if (lastPosition_S[ID]) {
            ctx.moveTo(lastPosition_S[ID][0], lastPosition_S[ID][1]);
            ctx.lineTo(x, y);
            ctx.stroke()
        }
        lastPosition_S[ID] = [x, y];
        return
    }
    if (lastPosition) {
        ctx.moveTo(lastPosition[0], lastPosition[1]);
        ctx.lineTo(x, y);
        ctx.stroke()
    }
    lastPosition = [x, y];

    socket.emit('drawClick', tmp)
}

function mouseDownEvent(event) {
    event.preventDefault();
    if (device) {
        var touch = event.originalEvent.targetTouches[0];
        x = touch.pageX;
        y = touch.pageY
    } else {
        x = event.clientX;
        y = event.clientY
    }
    _isDown = true;
    drawP(x, y, yanse, cuxi, 1)
}

function mouseMoveEvent(event) {
    event.preventDefault();
    if (_isDown) {
        if (device) {
            var touch = event.originalEvent.targetTouches[0];
            x = touch.pageX;
            y = touch.pageY
        } else {
            x = event.clientX;
            y = event.clientY
        }
        drawP(x, y, yanse, cuxi, 2)
    }
}

function mouseUpEvent(event) {
    event.preventDefault();
    if (_isDown) {
        _isDown = false;
        lastPosition = null
    }
}
