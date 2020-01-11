var express 		            = require("express"),
    app 				            = express(),
    mongoose 			          = require("mongoose"),
    bodyParser 			        = require("body-parser"),
    request                 = require("request"),
    passport                = require("passport"),
    User                    = require("./models/user"),
    localStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose");

app.post("/tesla", function(req,res){

  var email = req.body.email;
  var password = req.body.password;

  var options = {
    'method': 'POST',
    'url': 'https://owner-api.teslamotors.com/oauth/token',
    'headers': {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"grant_type":"password","client_id":"81527cff06843c8634fdc09e8ac0abefb46ac849f38fe1e431c2ef2106796384","client_secret":"c7257eb71a564034f9419ee651c7d0e5f7aa6bfbd18bafb5c5c033b093bb2fa3","email":email,"password":password})
  };

  var authCode = options.body[0];

  console.log(authCode);


  // request(options, function(error,response){
  //   if(error) throw new Error(error);

  //   var options = {
  //     'method': 'GET',
  //     'url': 'https://owner-api.teslamotors.com/api/1/vehicles',
  //     'headers': {
  //       'Authorization': 'Bearer cc32f63645ebdc33a232cdb62e3c2331c1887d3683e3be55affcb07c4bc652eb'
  //     }
  //   };
  //   request(options, function (error, response) { 
  //     if (error) throw new Error(error);
  //     console.log(response.body);
  //   });
    

});

app.listen(3000, function(){
  console.log("Calculator is listening on port 3000...");
});