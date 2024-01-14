const asyncHandler = require("express-async-handler");
const Places = require("../models/place");
const User = require("../models/user");
const { calculateDistance } = require("../utils/algo");
const { sendNotification } = require("../utils/sendNotification");

const savePlace = asyncHandler(async (req, res) => {

    const { name, location, cordinates, image } = req.body;
    const newPlace = await Places.create({ name, location, cordinates, image });
    res.json(newPlace).status(201);
});


const getPlaces = asyncHandler(async (req, res) => {

    try {
        const places = await Places.find({});
        res.json(places);

    } catch (error) {
        console.log(error)
    }




})

const update = asyncHandler(async (req, res) => {

    try {
        const places = await Places.findById(req.body.id);
        places.name  = req.body.name;
        places.location  = req.body.location;
        places.cordinates  = req.body.cordinates;
        places.image  = req.body.image;
        await places.save();
        res.json(places);

    } catch (error) {
        console.log(error)
    }




})






module.exports = {
    savePlace,
    getPlaces,
    update
};