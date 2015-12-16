var express = require('express');
var router = express.Router();
var path=require('path');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    //console.log('Time: ', Date.now());
    next();
});
// define the home page route
router.get('/', function(req, res) {
    res.send('Wringer home page');
});
// define the about route
router.get('/chat', function(req, res) {
    res.sendFile('index.html',{root:path.dirname(__dirname) + '/public/'});
});
// define the about route
router.get('/about', function(req, res) {
    res.send('About Wringer');
});
router.use(function (req, res) {
    res.send('go look for the app');
});
module.exports = router;