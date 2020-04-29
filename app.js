var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var fs = require("fs");
var dotenv = require("dotenv").config();
var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

// Routes
var index = require("./routes/index");
var admin = require("./routes/admin/index");
var reportRoutes = require("./routes/report/index");
var endpointRoutes = require("./routes/endpoint/index");
var internal = require("./routes/internal/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Session module initialization
app.use(
  require("express-session")({
    secret: process.env.APP_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//  Passport session extension init
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// This Middleware allows serving of static files in Express
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

// Favicon
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// Sets up express.router to intercept all incoming traffic
app.use("/", index);
app.use("/admin", admin);
app.use("/", reportRoutes);
app.use("/", endpointRoutes);
app.use("/", internal);

// Passport config
var Account = require("./models/accounts");
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(Account.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Configure the error page
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;

  // Wipe the stack trace if production
  res.locals.error =
    process.env.MODE === "dev"
      ? err
      : {
          status: err.status,
          stack: "",
        };
  
  res.status(err.status || 500);

  // Basic pass though for all pages
  res.render("error", {
    programName: process.env.APPLICATION_NAME_SHORT,
    ver: process.env.APPLICATION_VER,
    pageTitle: "(╯°□°）╯︵ ┻━┻  Ooops...",
    username: "",
    alerts: [],
    messages: [],
    user: req.user,
  });
});

// Include model files. Also kicks off the database
fs.readdirSync(__dirname + "/models").forEach(function (filename) {
  if (~filename.indexOf(".js")) {
    require(__dirname + "/models/" + filename);
  }
});

require(__dirname + "/models/sr-types/srtype.js");

module.exports = app;
