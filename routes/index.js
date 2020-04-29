/**
 *  INDEX
 *
 *  Entry point for the Universal Reporting System.
 *  This file handles all the routing code.
 */
"use strict";

var express = require("express");
var router = express.Router();
var request = require("request");
var passport = require("passport");
var multer = require("multer");

var LOGGER = require("../services/utils/logger");
var Account = require("../models/user");

router.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

let activeSession = { 
  programName: "URT",
  ver: process.env.APPLICATION_VER,
  pageTitle: "This is a default page title",
  alerts: [
    {
      status: "success",
      type: "donate.",
      time: "December 12, 2019",
      text: "A new monthly report is ready to download!",
      url: "#"
    },
    {
      status: "success",
      type: "donate.",
      time: "December 7, 2019",
      text: "$290.29 has been deposited into your account!",
      url: "#"
    }
  ],
  messages: [
    {
      status: "success",
      text: "Hi there! I am wondering if you can help me with a problem I've been having.",
      user: "Emily Fowler",
      img: "https://source.unsplash.com/CS2uCrpNzJY/60x60",
      timeAgo: "58m",
      url: "#"
    },
    {
      status: "warning",
      text: "I have the photos that you ordered last month, how would you like them sent to you?",
      user: "Jae Chun",
      img: "https://source.unsplash.com/AU4VPcFN4LE/60x60",
      timeAgo: "1d",
      url: "#"
    }
  ]
};

// Test upgraded index
router.get("/", function(req, res, next) {
  activeSession.pageTitle =  "Main Page";
  activeSession.user = req.user;
  res.render("index", activeSession);
});

// Login 
router.get("/login", hasAdminAccount, function(req, res) {
  activeSession.pageTitle = "Login Page";
  activeSession.user = req.user;
  activeSession.hasAdminAccount = req.hasAdmin;

  res.render("login", activeSession);
});

// Create First Time Admin. Basically a login overide that acts as a register.
router.get("/createAdmin", hasAdminAccount, function(req, res) {
  if (req.hasAdmin == false) {
    // If not, create an admin account
    let username = "admin";
    let password = "adminadmin";

    Account.register(new Account({ username: username }), password, function(err, account) {
      if (err) {
        return res.render("login");
      }

      passport.authenticate("local")(req, res, function() {
        req.session.save(function(err) {
          if (err) {
            return next(err);
          }
          res.redirect("/");
        });
      });
    });
  } else {
    // Trying to hack us
    res.redirect("/login", { hasAdminAccount: req.hasAdmin });
  }
});

// Enforce Login for posting at login page
router.post("/login", function(req, res) {
  passport.authenticate("local")(req, res, function() {
    res.redirect("/");
  });
});

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("./login");
});

router.get("/forgot-password", function(req, res) {
  activeSession.pageTitle = "Welcome to the Universal Reporting Tool";
  activeSession.user = req.user;
  res.render("./forgot-password", activeSession);
});

router.get("/register", function(req, res) {
  activeSession.pageTitle = "Welcome to the Universal Reporting Tool";
  activeSession.user = req.user;
  res.render("./register", activeSession);
});

/**
 * Middlewear
 */
/**
 * hasAdminAccount
 * Checks the database to see if a admin user acccount has been 
 * made for this instance of the URT. Sets a one time flag in the
 * req based on the status.
 *  
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * 
 * @returns Bool via one time flag 'hasAdmin' in req
 */
function hasAdminAccount(req, res, next) {
  Account.find({ username: "admin" }, function(err, docs) {
    if (!docs || docs.length == 0) {
      req.hasAdmin = false;
    } else {
      req.hasAdmin = true;
    }
    next();
  });
}

/**
 * checkLoggedIn
 * Provides a checkpoint to ensure the user is logged in. 
 * Redirects to login if authentication fails.
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

function checkAdmin(req, res, next) {
  if (req.user) {
    if (req.user.username == "admin") {
      next();
    } else {
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
}



module.exports = router;
