const express = require('express');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
const User = require('../models/user');
const Parking = require('../models/parking');
const { isLoggedIn } = require('../middleware');

const router = express.Router();


router.get('/', isLoggedIn, async (req, res) => {
    const id = req.user._id;
    const owner = await User.findById(id).populate('parkings');
    res.render('parkings/owner', { owner });
})

router.route('/new')
    .get(isLoggedIn, (req, res) => {
        res.render('parkings/new');
    })
    .post(isLoggedIn, async (req, res) => {
        const id = req.user._id;
        const { name, location, totalSlots, availableSlots, rate, openTime, closeTime } = req.body;
        const parking = new Parking({ name, location, totalSlots, availableSlots, rate, openTime, closeTime });
        parking.owner = id;
        const geoData = await maptilerClient.geocoding.forward(location, { limit: 1 });
        parking.geometry = geoData.features[0].geometry;
        const owner = await User.findById(id);
        owner.parkings.push(parking._id);
        await parking.save();
        await owner.save();
        res.redirect(`/parkings/owner`);
    })

router.route('/:parkingId')
    .get(isLoggedIn, async (req, res) => {
        const { parkingId } = req.params;
        const parking = await Parking.findById(parkingId).populate('users.user').populate('owner');
        res.render('parkings/details', { parking });
    })
    .put(isLoggedIn, async (req, res) => {
        const { parkingId } = req.params;
        const { location } = req.body;
        const parking = await Parking.findOneAndUpdate({ _id: parkingId }, req.body, { new: true, runValidators: true });
        const geoData = await maptilerClient.geocoding.forward(location, { limit: 1 });
        parking.geometry = geoData.features[0].geometry;
        await parking.save();
        res.redirect(`/parkings/owner/${parkingId}`);
    })
    .delete(isLoggedIn, async (req, res) => {
        const { parkingId } = req.params;
        const parking = await Parking.findById(parkingId);
        await User.updateMany({ _id: { $in: parking.users } }, { $pull: { parkings: parkingId } });
        await parking.deleteOne();
        if (req.isAdmin)
            return res.redirect('/parkings');
        res.redirect(`/parkings/owner`);
    })

router.get('/:parkingId/edit', isLoggedIn, async (req, res) => {
    const { parkingId } = req.params;
    const parking = await Parking.findById(parkingId);
    res.render('parkings/update', { parking })
})

router.delete('/:parkingId/:userId', isLoggedIn, async (req, res) => {
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
    await parking.save()
    await User.updateOne({ _id: userId }, { $pull: { parkings: parkingId } });
    res.redirect(`/parkings/owner/${parkingId}`);
})

module.exports = router;