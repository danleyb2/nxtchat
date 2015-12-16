var OBJarray = function ( a ) {
    return [].slice.call( a );
};

var docById = function ( id ) {
    return document.getElementById(id);
};

var $ = function ( selector, context ) {
    context = context || document;
    return context.querySelector(selector);
};

var $$ = function ( selector, context ) {
    context = context || document;
    return OBJarray( context.querySelectorAll(selector) );
};

var socket;
var user={
    from:'',
    to:'',
    username:''
};
socket=io();
socket.on('connect_error', function (err) {
    console.log(err);
});
socket.on('reconnect_error', function (err) {

});
socket.on('connect_timeout', function () {

});
socket.on('reconnect', function (number) {

});
socket.on('reconnecting', function (number) {

});
socket.on('reconnect_attempt', function () {

});
socket.on('connect', function () {
    console.log('connected');
    docById('s').style.backgroundColor='#000000';
});
socket.on('disconnect', function () {
    docById('s').style.backgroundColor='#004444';
});

socket.on('chat message',function(mesg){
    var msg=JSON.parse(mesg);
    var div=document.createElement('DIV');
    if(msg.from==user.from){
        div.innerHTML="You-:"+msg.content;
        div.classList.add('b');
    }else{
        div.innerHTML=msg.from+"-:"+msg.content;
        div.classList.add('a');
    }
    $('#history').appendChild(div);
});
socket.on('typing',isTypingOn);
socket.on('stop typing',isTypingOff);
socket.on('login', function (status) {
    docById('me').style.color='rgb(199, 167, 39)';
    styleHeader(status.offline);
});
socket.on('offline',function(mesg){
    docById('you').style.color='#C3C8C3';
});
socket.on('online',function(mesg){
    docById('you').style.color='rgb(199, 167, 39)';
});
socket.on('tg',function(mesg){});

function MessageObj(from,to ,content) {
    this.from=from;
    this.to=to;
    this.content=content;

}
function styleHeader(offline){
    if(offline){
        docById('you').style.color='#C3C8C3';
        //docById('you').style.color='';
    }else{
        //docById('me').style.color='';
        docById('you').style.color='rgb(199, 167, 39)';
    }
}
window.onkeydown=function(event){
    if(checkBox(event) && event.keyCode==13){
        sendNew();
        return false;
    }
};
function sendNew(evt){
    evt.preventDefault();
    console.log('send new');
    if(user.from != '' && user.to!=''){
        var msg=docById('message').value.toString().trim();
        if(msg!=="") {
            //send message
            var ms = new MessageObj(user.from,user.to, msg);
            console.log('emiting message');
            socket.emit('chat message',JSON.stringify(ms));
            document.getElementById('message').value = "";

        }else{
            console.log("Can't send a blank message");
            docById('message').value = "";
        }
    }else{
        alert('First enter from and to..');
    }
}
function emitTyping(evt){
    socket.emit('typing',user);
}
function stopEmitTyping(evt){
    socket.emit('stop typing',user);
}
function initChat(evt){
    evt.preventDefault();
    var from=docById('from').value.toString().trim();
    var to=docById('to').value.toString().trim();
    if(from!=="" && to!=="") {
        //add user
        user.from=from;
        user.to=to;
        socket.emit('chat',JSON.stringify(user));
        docById('from').value="";
        docById('to').value="";
    }else{
        alert("from and to cannot be empty");
    }
}
function isTypingOn(user){
    docById('typing').style.display='inline';
}
function isTypingOff(user){
    docById('typing').style.display='none';

}
function checkBox(evt) {return docById('chk').checked;}
window.onload= function () {

    docById('go').addEventListener('click',initChat );
    docById('send').addEventListener('click',sendNew );
    docById('message').addEventListener('input',emitTyping );
    docById('message').addEventListener('blur',stopEmitTyping );
    //docById('').addEventListener('click', );
};
