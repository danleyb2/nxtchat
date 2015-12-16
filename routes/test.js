module.exports = function (app, io) {
    app.post('/test', function (req, res) {
        //I would like here be able to send to all clients in room "test"
        io.to('test').emit('some event');
    });
};