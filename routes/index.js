const { application } = require('express');
var express = require('express');
var router = express.Router();
const request = require('request')
const app=express();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// recaptcha
router.post("/verify",(req,res)=>{
  if(
    req.body.captcha ===undefined||
    req.body.captcha === ''||
    req.body.captcha === null
  ){
    return res.json({"success":false,"msg":"Please Complete the verification"});
  }
  //secret key
  const secretKey ='6LfZ7EwdAAAAACPAzXJSGtlru0EF3DmPHEp_kQoj';

  //verify URL
  const verifyURL=`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`

})

module.exports = router;
