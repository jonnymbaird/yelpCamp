"use strict";
require("dotenv").config();

const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

// Require Route Files

const indexRoutes = require("./routes/index"),
    campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments");


//initialise mongoose
//mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true }); // Local
//mongoose.connect("mongodb://jbaird:fm3BLAnt@ds127604.mlab.com:27604/yelpcamp_jbaird", { useNewUrlParser: true }); // mdlab
const url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
mongoose.connect(url, { useNewUrlParser: true }); 

mongoose.set("useFindAndModify", false);

app.use(bodyParser.urlencoded({ extended: true, }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment")

//seedDB(); // seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "this is a secret for passport",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



// cloud listener
// app.listen(process.env.PORT, process.env.IP, function() {
//     console.log("YelpCamp Server has started");
// });

// Local listener
app.listen(3000, function() {
    console.log("YelpCamp Server has started");
});