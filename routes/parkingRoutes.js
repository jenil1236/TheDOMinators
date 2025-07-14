const express = require('express');
const User = require('../models/user');
const Parking = require('../models/parking');
const { isLoggedIn } = require('../middleware/auth');
const passport = require('passport');
const ParkingUser = require('../models/parkinguser');

const router = express.Router();

router.route('/register')
    .get((req, res) => {
        res.render('users/register');
    })
    .post(async (req, res, next) => {
        try {
            const { name, phone, email, password, username } = req.body;
            const newUser = new User({ name, phone, email, username });
            const registeredUser = await User.register(newUser, password);
            req.login(registeredUser, err => {
                if (err) return next(err);
                return res.redirect('/parkings');
            });
        } catch (e) {
            return next(e);
        }
    });

router.route('/login')
    .get((req, res) => {
        res.render('users/login');
    })
    .post(passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
        return res.redirect('/parkings');
    });

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        return res.redirect('/register');
    });
});

router.route('/parkings')
    .get(async (req, res, next) => {
        try {
            const allParkings = await Parking.find();
            return res.render('parkings/role', { allParkings });
        } catch (e) {
            return next(e);
        }
    })
    .post(isLoggedIn, async (req, res, next) => {
        try {
            const id = req.user._id;
            let parkinguser = await ParkingUser.findOne({ user: id });
            if (!parkinguser) {
                parkinguser = new ParkingUser({ user: id });
                await parkinguser.save();
            }
            req.session.parkinguserId = parkinguser._id;
            const { isOwner } = req.body;
            if (isOwner === 'true') {
                return res.redirect('/parkings/owner');
            } else {
                return res.redirect('/parkings/user');
            }
        } catch (e) {
            return next(e);
        }
    });

module.exports = router;
