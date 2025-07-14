const express = require('express');
const Parking = require('../models/parking');
const { isAdmin } = require('../middleware/auth');
const ParkingUser = require('../models/parkinguser');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('users/adminLogin');
});

router.route('/dashboard')
    .get((req, res) => {
        if (!req.isAdmin) return res.redirect('/admin/login');
        res.render('users/admin');
    })
    .post(isAdmin, (req, res) => {
        res.redirect('/admin/dashboard');
    });

router.get('/logout', (req, res) => {
    req.session.isAdmin = false;
    req.isAdmin = false;
    res.locals.isAdmin = false;
    res.redirect('/admin/login');
});


router.get('/parkingusers', async (req, res, next) => {
    try {
        if (!req.isAdmin) return res.redirect('/admin/login');
        const parkingusers = await ParkingUser.find().populate('user');
        res.render('users/users', { parkingusers });
    } catch (err) {
        next(err);
    }
});

router.delete('/parkingusers/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const parkinguser = await ParkingUser.findOne({ _id: id }).populate('parkings');
        if (!parkinguser) {
            const error = new Error('ParkingUser not found');
            error.status = 404;
            throw error;
        }

        const user = parkinguser.user;
        const parkings = parkinguser.parkings;

        for (const parking of parkings) {
            const userEntry = parking.users.find(entry => entry.user.equals(user));
            if (userEntry) {
                if (userEntry.vehicle === 'car') parking.availableSlots += 4;
                else if (userEntry.vehicle === 'auto') parking.availableSlots += 3;
                else parking.availableSlots += 2;
                parking.users = parking.users.filter(entry => !entry.user.equals(user));
                await parking.save();
            }
        }

        await Parking.deleteMany({ owner: user });
        await ParkingUser.deleteOne({ _id: id });

        res.redirect('/admin/parkingusers');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
