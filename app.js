var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var flash = require("connect-flash");
var session = require("express-session");
var dotenv = require("dotenv");
dotenv.config();

// routes
var index = require("./routes/index");
var users = require("./routes/users");

// init app
var app = express();

// view engine
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", exphbs({ defaultLayout: "layout" }));
app.set("view engine", "handlebars");

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set directory for publically available resources
app.use(express.static(path.join(__dirname, "public")));

// express session init
app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 900000, // 15 mins expiration for the cookie
    },
  })
);

// connect flash init
app.use(flash());

// global vars
const navs = require("./views/components/navs.json");
app.use(function (req, res, next) {
  res.locals.navs = navs;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.register_success = req.flash("register_success");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", index);
app.use("/users", users);
app.use( function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

// ignition
app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), function () {
  console.log("Ignition success at port " + app.get("port"));
});
