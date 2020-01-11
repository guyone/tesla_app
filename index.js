var express 		        = require("express"),
    app 				    = express(),
    mongoose 			    = require("mongoose"),
    bodyParser 			    = require("body-parser"),
    request                 = require("request"),
    passport                = require("passport"),
    User                    = require("./models/user"),
    localStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

app.use(require("express-session")({
    secret: "Tesla rules and will save the world",
    resave: false,
    saveUninitialized: false
}));

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req,res){
    res.render("login");
});

app.post("/", function(req,res){
    var email = req.body.username;
    var password = req.body.password;
    var teslaPOST = {
        'method': 'POST',
        'url': 'https://owner-api.teslamotors.com/oauth/token',
        'headers': {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'
        },
        body: JSON.stringify({"grant_type":"password","client_id":"81527cff06843c8634fdc09e8ac0abefb46ac849f38fe1e431c2ef2106796384","client_secret":"c7257eb71a564034f9419ee651c7d0e5f7aa6bfbd18bafb5c5c033b093bb2fa3","email":email,"password":password})
      };
    request(teslaPOST, function (error, response) { 
        if (error){
            console.log(error);
            res.render("incorrect");
        } else {
        var teslaPOSTData = JSON.parse(response.body);
        var authCode = teslaPOSTData.access_token;
        var teslaGET = {
            'method': 'GET',
            'url': 'https://owner-api.teslamotors.com/api/1/vehicles',
            'headers': {
            'Authorization': 'Bearer ' + authCode,
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'
            }
        };
            request(teslaGET, function (error, response) { 
                if (error){
                    console.log(error);
                    res.render("404");
                } else {
                    var teslaGETData = JSON.parse(response.body);
                    var vehicleID = teslaGETData.response[0].id_s;
                    var options = {
                        'method': 'GET',
                        'url': 'https://owner-api.teslamotors.com/api/1/vehicles/' + vehicleID + '/vehicle_data/',
                        'headers': {
                        'Authorization': 'Bearer ' + authCode,
                        'Content-Type': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'
                        }
                    };
                    request(options, function (error, response) { 
                        if (error){
                            console.log(error);
                            res.render("404");
                        } else {
                            var teslaData = JSON.parse(response.body);
                            res.render("tesla", {teslaData:teslaData});
                            };
                    });
                };
            });
        };
    });

});

app.listen(3000, function(){
    console.log("Calculator is listening on port 3000...");
});