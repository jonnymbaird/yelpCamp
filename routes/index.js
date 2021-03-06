const express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    Campground = require("../models/campground"),
    passport = require("passport"),
    middleware = require("../middleware");
    
// ===================
// ROOT ROUTE
// ===================

router.get("/", function(req, res) {
    res.render("landing");
});

// =================
// AUTH ROUTES
// =================

router.get("/register", function(req, res) {
    res.render("register", {page: 'register'});
});

router.post("/register", function(req, res) {
    const newUser = new User({ 
        username: req.body.username, 
        firstName: req.body.firstName,  
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    if(req.body.adminCode === "secretcode123"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp " + user.username)
            res.redirect("/campgrounds");
        });
    });
});


router.get("/login", function(req, res) {
    res.render("login", {page: 'login'});
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {
    //res.send("login post route");
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("back");
})

// USER PROFILE
router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            }
            res.render("users/show", {page: 'profile', user: foundUser, campgrounds: campgrounds});
        });
    });
});

module.exports = router;