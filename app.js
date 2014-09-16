
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var sio = require('socket.io');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'ejs');
app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/opt', routes.opt)

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = sio.listen(server);
var roomList = {};
var socketMap = {};

io.on('connection', function(socket){

    //create a room
    socket.on('iJoin', function(data){
        var roomid = data.room;
        var user = {
            id: socket.id,
            ip:socket.handshake.address,
            cname: ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6)
        }

        console.log(user);

        //把socket 加入房间
        socket.join(roomid);
        socket['roomid'] = roomid;
        socketMap[socket.id] = socket;

        var sid = user.id;

        //假如room已经存在，则添加，不存在，则创建
        if(in_array(roomList, roomid)){
            roomList[roomid][sid] = user;
        }else {
            roomList[roomid] = {};
            roomList[roomid][sid] = user;
        }

        console.log('^^^^^^^^^^^^^^^^^^')
        console.log(roomList)

        var data = {
            'members':roomList[roomid],
            'user':user
        }
        //给群里所有人广播
        setTimeout(function () {
            socket.broadcast.in(roomid).emit('userIn', data);
            socket.emit('userIn', data);
            console.log('shit    .....')
        }, 500)



    })

    //客户端该名称
    socket.on('setNickname', function(nickname){
        var roomid = socket['roomid'];
        roomList[roomid][socket.id]['cname'] = nickname;
        var user = {
            id: socket.id,
            cname: nickname
        }
        console.log('setNickname .................')
        console.log(roomList)
        socket.broadcast.to(socket.roomid).emit('shake hands', user);
    })


    socket.on('disconnect', function(){
        var user = {
            id: socket.id,
            ip:socket.handshake.address,
            cname: roomList[roomid][socket.id]['cname']
        }

        var roomid = socket['roomid'];
        delete roomList[roomid][socket.id];

        socket.broadcast.to(socket.roomid).emit('userOut', user);
    })

    socket.on('say msgs', function(data){
        console.log('say msg..............')
        console.log(data)
        if(data.id){
            var msg = {
                to:data.id,
                id: socket.id,
                txt:data.say
            }
            socketMap[data.id].emit('say msg', msg);
        }else{
            var msg = {
                id: socket.id,
                txt:data.say
            }
            socket.broadcast.in(socket.roomid).emit('say msg', msg);
        }
    })

    socket.on('drawClick', function(data){
        socket.broadcast.in(socket.roomid).emit('draw', data.data);
    })
})

function in_array(arr, str){
    for(var index in arr){
        if(index == str){
            return true;
        }
    }
    return false;
}

