const express = require('express');
const Parking = require('../models/parking');
const ParkingUser = require('../models/parkinguser');
const { isLoggedIn } = require('../middleware/auth');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const id = req.parkinguserId;
        const user = await ParkingUser.findById(id).populate('parkings');
        const allParkings = await Parking.find({ _id: { $nin: user.parkings } });
        return res.render('parkings/user', { user, allParkings });
    } catch (err) {
        return next(err);
    }
});

router.route('/:parkingId')
    .get(isLoggedIn, async (req, res, next) => {
        try {
            const { parkingId } = req.params;
            const parking = await Parking.findById(parkingId).populate('owner');
            return res.render('parkings/book', { parking });
        } catch (err) {
            return next(err);
        }
    })
    .post(isLoggedIn, async (req, res, next) => {
        try {
            const id = req.user._id;
            const parkinguserId = req.parkinguserId;
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
            const parkinguser = await ParkingUser.findById(parkinguserId);
            parking.users.push({ user: id, vehicle });
            await parking.save();
            parkinguser.parkings.push(parking);
            await parkinguser.save();
            return res.redirect(`/parkings/user`);
        } catch (err) {
            return next(err);
        }
    })
    .delete(isLoggedIn, async (req, res, next) => {
        try {
            const id = req.user._id;
            const parkinguserId = req.parkinguserId;
            const { parkingId } = req.params;
            const parking = await Parking.findById(parkingId);
            // console.log(parking.users);
            const parkinguser = await ParkingUser.findOne({ _id: parkinguserId });

            if (parkinguser.vehicle == 'car')
                parking.availableSlots += 4;
            else if (parkinguser.vehicle == 'auto')
                parking.availableSlots += 3;
            else
                parking.availableSlots += 2;

            parking.users = parking.users.filter(entry => !entry.user.equals(id));
            await parking.save();
            await ParkingUser.updateOne({ user: id }, { $pull: { parkings: parkingId } });
            return res.redirect(`/parkings/user`);
        } catch (err) {
            return next(err);
        }
    });

module.exports = router;
