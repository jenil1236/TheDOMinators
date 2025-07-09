const express = require('express');
const User = require('../models/user');
const Parking = require('../models/parking');
const { isLoggedIn } = require('../middleware');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res) => {
    const id = req.user._id;
    const user = await User.findById(id).populate('parkings');
    const allParkings = await Parking.find({ _id: { $nin: user.parkings } });
    res.render('parkings/user', { user, allParkings });
})

router.route('/:parkingId')
    .get(isLoggedIn, async (req, res) => {
        const { parkingId } = req.params;
        const parking = await Parking.findById(parkingId).populate('owner');
        res.render('parkings/book', { parking });
    })
    .post(isLoggedIn, async (req, res) => {
        const id = req.user._id;
        const { parkingId } = req.params;
        const { vehicle } = req.body;
        let requiredSlots;
        if (vehicle == 'car')
            requiredSlots = 4;
        else if (vehicle == 'auto')
            requiredSlots = 3;
        else
            requiredSlots = 2;
        const parking = await Parking.findById(parkingId);
        if (parking.availableSlots < requiredSlots)
            return res.send('Slots not available');
        parking.availableSlots = parking.availableSlots - requiredSlots;
        const user = await User.findById(id);
        parking.users.push({ user, vehicle });
        await parking.save();
        user.parkings.push(parking);
        await user.save();
        res.redirect(`/parkings/user`);
    })
    .delete(isLoggedIn, async (req, res) => {
        const id = req.user._id;
        const { parkingId } = req.params;
        const parking = await Parking.findById(parkingId);
        const user = parking.users.find(entry => entry.user.equals(id));
        if (user.vehicle == 'car')
            parking.availableSlots += 4;
        else if (user.vehicle == 'auto')
            parking.availableSlots += 3;
        else
            parking.availableSlots += 2;
        parking.users = parking.users.filter(entry => !entry.user.equals(id));
        await parking.save()
        await User.updateOne({ _id: id }, { $pull: { parkings: parkingId } });
        res.redirect(`/parkings/user`);
    })

module.exports = router;