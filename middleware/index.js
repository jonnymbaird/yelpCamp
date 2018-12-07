const   Campground = require("../models/campground"),
        Comment = require("../models/comment");

// All the middleware goes here

let middlewareObj = {};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
         Comment.findById(req.params.comment_id).exec(function(err, foundComment) {
            if (err) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            }
            else {
                if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "You dont have permision to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}


middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
         Campground.findById(req.params.id).exec(function(err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            }
            else {
                if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "You dont have permision to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;