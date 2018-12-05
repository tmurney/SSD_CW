var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use( session({
    secret: "it's a secret",
    cookie: { maxAge: 300000 }
  })
);
app.use(cookieParser());

const port = process.env.PORT || 8080;


const Users = [

    { id: 1, user: "admin", pass: "12345"},
    { id: 2, user: "guest", pass: "password"}
]

// viewed at http://localhost:8080
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

// viewed at http://localhost:8080/login
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname + "/log_in/login.html"));
  
});

//If user can access the page or not
function checkSignIn(req, res, next) {
  if (req.session.user) {
    next(); //If session exists, proceed to page
  } else {
    var err = new Error("Not logged in!");
    console.log(req.session.user);
    next(err); //Error, trying to access unauthorized page!
  }
}


app.get("/checker", checkSignIn, function(req, res) {
  res.sendFile(path.join(__dirname + "/application/checker.html"));
});



app.post("/login", function(req, res) {

    var login_username = req.body.uid;
    var login_password = req.body.password;


  console.log(login_username);
  console.log(login_password);


  if (!login_username || !login_password) {
    console.log("need both mate");
  } else {
    Users.filter(function(Users) {
      if (Users.user === login_username && Users.pass === login_password) {
        req.session.user = Users;
        res.redirect("/checker");
      }
    });
    
  }
});


app.get("/logout", function(req, res) {
  delete req.session.user;
  res.redirect("/login");
});  

app.listen(port, () => console.log(`Listening on port ${port}...`));
