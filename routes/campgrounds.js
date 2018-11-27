const express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground");
    
// ==============================================
// Campgrounds ROUTES
// ==============================================
// INDEX - show all campgrounds
router.get("/", function(req, res) {
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
        }
    });
});

// NEW - show form to create new campgrounds
router.get("/new", function(req, res) {
    res.render("campgrounds/new");
});

// CREATE - add new campground to DB
router.post("/", function(req, res) {
    //get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let newCampground = { name: name, image: image, description: description };
    //create new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/campgrounds");
        }
    })
});

// SHOW - show more info about 1 campground
router.get("/:id", function(req, res) {

    //Find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            //show the extra information about the campground
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });

});

module.exports = router;