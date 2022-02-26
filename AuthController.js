var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./config');

obj={}
router.post('/consent/:mobileNumber', function(req, res) {
  console.log(req.body)
  
});
app.get('/checklogin', (req, res)=> {
    var token = req.headers['x-access-token'];
    if (!token) return res.send({ auth: false,wait:false, message: 'No token provided.' });
    jwt.verify(token,config.JWT_secret, (err, decoded)=> {
    if (err) return res.send({ auth: false,wait:false, message: 'Failed to authenticate token.' });
    //match jwt in db
    //use phno to find wait(pending state)
    res.send({auth:true,wait:false,message:"login successful"});

    });
  });
  router.post('/logout', (req, res)=> {
    var token = req.headers['x-access-token'];
    if (token)
    jwt.verify(token,config.JWT_secret, (err, decoded)=> {
        if (!err) ;
        //remove jwt token
    });
  });
  module.exports = router;