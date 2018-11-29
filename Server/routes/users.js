var express = require('express');
var router = express.Router();

var ResponseType = {
  INVALID_USERNAME :0,
  INVALID_PASSWORD :1,
  SUCCESS:2,
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//회원가입
router.post('/add',function(req,res,next){
  var username = req.body.username;
  var password = req.body.password;
  var nickname = req.body.nickname;
  //var score = req.body.score;

  var database = req.app.get("database");
  var users = database.collection('users');

  if(username !== undefined && password !== undefined && nickname !== undefined)
  {
      users.insert([{"username": username , "password": password , "nickname": nickname }], function(err,result){
        res.status(200).send("success");
    });
  }
});

//로그인
router.post('/find',function(req,res,next){
  var username = req.body.username;
  var password =req.body.password;

  var database = req.app.get("database");
  var users = database.collection('users');

  if(username !== undefined && password != undefined){
    users.findOne({username: username},
      function(err,result){
        if(result){
          if(password === result.password) {
            res.json({result:ResponseType.SUCCESS});
          }else{
            res.json({result:ResponseType.INVALID_PASSWORD});
          }     
        }else{
          res.json({result:ResponseType.INVALID_USERNAME});
      }
    });
  }
});

//계정 조회
router.post('/serch',function(req,res,next){
var username = req.body.username;

var database = req.app.get("database");
var users = database.collection('users');

if(username !== undefined){
  users.findOne({username: username}, function(err,result) {
    if(result.score === undefined){
      users.update({username:username},{username:result.username,password:result.password,nickname:result.nickname,score:0},function(err,result){
        users.findOne({username: username}, function(err,result) {
          res.json({username:username,nickname:result.nickname,score:result.score});
        });
      });
    }else{
      res.json({username:result.username,nickname:result.nickname,score:result.score});
    }
  });
}
});

module.exports = router;
