const   Campground = require("../models/campground"),
        Comment = require("../models/comment");

// All the middleware goes here

let middlewareObj = {};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
         Comment.findById(req.params.comment_id).exec(function(err, foundComment) {
            if (err) {
                console.log(err);
                res.redirect("back");
            }
            else {
                if (foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    console.log("wrong user")
                    res.redirect("back");
                }
            }
        });
    } else {
        console.log("Not Logged in");
        res.redirect("back");
    }
}


middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
         Campground.findById(req.params.id).exec(function(err, foundCampground) {
            if (err) {
                console.log(err);
                res.redirect("back");
            }
            else {
                if (foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    console.log("wrong user")
                    res.redirect("back");
                }
            }
        });
    } else {
        console.log("Not Logged in");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;