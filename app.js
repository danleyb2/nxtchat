var exp=require('express');
var http = require('http');
app=exp();
var server = http.Server(app);
var io = require('socket.io')(server);

var db = require('./db');


/*
 var query = new Parse.Query(Parse.User);
 query.find({
 success: function(users) {
 for (var i = 0; i < users.length; ++i) {
 console.log(users[i].get('username'));
 }
 }
 });*/

const PORT = process.env.OPENSHIFT_NODEJS_PORT || 8000;
const IP = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
app.set('port', PORT);
app.set('ipaddr', IP);
if (typeof app.get('ipaddr') === "undefined") {
    console.warn('No OPENSHIFT_NODEJS_IP environment variable');
};
app.use(exp.static('public',{'index':false}));
app.use('/', require('./routes/index'));
server.listen(PORT,IP, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});


var database;
io.on('connection', function (socket) {
    console.log('connected to client');
    /*db.connect('ussdke',function (err) {
     if(err){
     console.log('could not connect to database. '+err.message);
     return false
     }else{
     database=db.get();
     }
     });*/
    socket.on('typed',function(typed){
        socket.to(socket.eTo).emit('typed',typed);
        console.log(typed);
    });
    socket.on('send full message',function(cnt){
        socket.to(socket.eTo).emit('send full message',cnt);
        console.log("[*] Full message request..");
    });

    socket.on('chat message', function (msg) {
        console.log(msg);


        socket.to(socket.eTo).emit('stop typing', {
            //todo username: socket.username
            username: socket.eTo
        });
        socket/*.to(socket.eTo)*/.emit('chat message',msg);return;// todo remove after test
        var pMsg = JSON.parse(msg);
        //console.log(typeof dmsg);
        //console.log(dmsg);
        //msg.from = socket.decoded_token._id;
        var to = pMsg.to;
        //console.log(pMsg.to);
        //console.log(io.sockets.adapter.rooms);
        socket.emit('chat message', msg);
        if ((io.sockets.adapter.rooms[to]) == undefined) {
            console.log("user [%s] is not connected", to);
            //store message to db

            //create a push notification
            /*var Ms=Parse.Object.extend("Message");
             var ms=new Ms();
             ms.set("from","");
             ms.set("to","");
             ms.save(null, {
             success: function(gameScore) {
             // Execute any logic that should take place after the object is saved.
             console.log('New object created with objectId: ' + gameScore.id);
             },
             error: function(gameScore, error) {
             // Execute any logic that should take place if the save fails.
             // error is a Parse.Error with an error code and message.
             console.error('Failed to create new object, with error code: ' + error.message);
             }
             });*/

        } else {
            socket.to(to).emit('chat message', msg);
        }
    });


    socket.on('disconnect', function () {
    //socket.leave()
        socket.to(socket.eTo).emit('offline');
    });
    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function () {
        socket.to(socket.eTo).emit('typing', {
            //todo username: socket.username
            username: socket.eTo
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', function () {
        socket.to(socket.eTo).emit('stop typing', {
            // username: socket.username
            username: socket.eTo
        });
    });

    socket.on('chat', function (loginT) {
        console.log('Chat init');
        var login = JSON.parse(loginT);
        socket.eTo = login.to;//todo send spouse phone
        socket.leave(socket.rooms);
        socket.join(login.from);
        //console.log('rooms : '+socket.rooms);
        var isoffline=(io.sockets.adapter.rooms[login.to]) === undefined;
        socket.emit('login', {
            offline:isoffline
        });
        if(!isoffline) {
            socket.to(login.to).emit('online');
        }

    });
});

//require('./routes/test')(app,io);


