const express = require('express');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
const Parking = require('../models/parking');
const { isLoggedIn } = require('../middleware/auth');
const ParkingUser = require('../models/parkinguser');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const id = req.parkinguserId;
        const owner = await ParkingUser.findById(id).populate('parkings');
        return res.render('parkings/owner', { owner });
    } catch (err) {
        return next(err);
    }
});

router.route('/new')
    .get(isLoggedIn, (req, res) => {
        return res.render('parkings/new');
    })
    .post(isLoggedIn, async (req, res, next) => {
        try {
            const id = req.user._id;
            const parkinguserId = req.parkinguserId;
            const { name, location, totalSlots, availableSlots, rate, openTime, closeTime } = req.body;
            const parking = new Parking({ name, location, totalSlots, availableSlots, rate, openTime, closeTime });
            parking.owner = id;
            const geoData = await maptilerClient.geocoding.forward(location, { limit: 1 });
            parking.geometry = geoData.features[0].geometry;
            const owner = await ParkingUser.findById(parkinguserId);
            owner.parkings.push(parking._id);
            await parking.save();
            await owner.save();
            return res.redirect(`/parkings/owner`);
        } catch (err) {
            return next(err);
        }
    });

router.route('/:parkingId')
    .get(isLoggedIn, async (req, res, next) => {
        try {
            const { parkingId } = req.params;
            const parking = await Parking.findById(parkingId).populate('users.user').populate('owner');
            return res.render('parkings/details', { parking });
        } catch (err) {
            return next(err);
        }
    })
    .put(isLoggedIn, async (req, res, next) => {
        try {
            const { parkingId } = req.params;
            const { location } = req.body;
            const parking = await Parking.findOneAndUpdate({ _id: parkingId }, req.body, { new: true, runValidators: true });
            const geoData = await maptilerClient.geocoding.forward(location, { limit: 1 });
            parking.geometry = geoData.features[0].geometry;
            await parking.save();
            return res.redirect(`/parkings/owner/${parkingId}`);
        } catch (err) {
            return next(err);
        }
    })
    .delete(isLoggedIn, async (req, res, next) => {
        try {
            const { parkingId } = req.params;
            const parking = await Parking.findById(parkingId);
            await ParkingUser.updateMany({ user: { $in: parking.users } }, { $pull: { parkings: parkingId } });
            await parking.deleteOne();
            if (req.isAdmin) return res.redirect('/parkings');
            return res.redirect(`/parkings/owner`);
        } catch (err) {
            return next(err);
        }
    });

router.get('/:parkingId/edit', isLoggedIn, async (req, res, next) => {
    try {
        const { parkingId } = req.params;
        const parking = await Parking.findById(parkingId);
        return res.render('parkings/update', { parking });
    } catch (err) {
        return next(err);
    }
});

router.delete('/:parkingId/:userId', isLoggedIn, async (req, res, next) => {
    try {
        const { parkingId, userId } = req.params;
        const parking = await Parking.findById(parkingId);
        const user = parking.users.find(entry => entry.user.equals(userId));
        if (user.vehicle == 'car')
            parking.availableSlots += 4;
        else if (user.vehicle == 'auto')
            parking.availableSlots += 3;
        else
            parking.availableSlots += 2;
        parking.users = parking.users.filter(entry => !entry.user.equals(userId));
        await parking.save();
        const parkinguser = await ParkingUser.findOne({ user: userId });
        await ParkingUser.updateOne({ _id: parkinguser._id }, { $pull: { parkings: parkingId } });
        return res.redirect(`/parkings/owner/${parkingId}`);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
