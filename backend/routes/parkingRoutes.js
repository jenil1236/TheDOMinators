const express = require('express');
const User = require('../models/user');
const Parking = require('../models/parking');
const { isLoggedIn } = require('../middleware/auth');
const passport = require('passport');
const ParkingUser = require('../models/parkinguser');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res, next) => {
    try {
        const { name, phone, email, password, username } = req.body;
        const newUser = new User({ name, phone, email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            res.status(200).json({ message: 'Registered and logged in', user: registeredUser });
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// LOGIN
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json({
        message: 'Login successful',
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email
        },
        isAdmin: req.session.isAdmin || false
    });
});

// LOGOUT
router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return res.status(500).send("Logout error");
        req.session.destroy(() => {
            res.clearCookie("connect.sid"); // Optional: clears session cookie
            res.status(200).json({ message: "Logged out successfully" });
        });
    });
});

router.post('/parkings', isLoggedIn, async (req, res, next) => {
    try {
        const id = req.user._id;
        let parkinguser = await ParkingUser.findOne({ user: id });
        if (!parkinguser) {
            parkinguser = new ParkingUser({ user: id });
            await parkinguser.save();
        }

        req.session.parkinguserId = parkinguser._id;
        const { isOwner } = req.body;

        return res.status(200).json({
            message: 'Role set',
            role: isOwner === 'true' ? 'owner' : 'user'
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
});

router.get("/parkings", async (req, res, next) => {
    try {
        console.log(req.isAdmin)
        const allParkings = await Parking.find();
        res.status(200).json({ allParkings }); // ✅ JSON response for React
    } catch (e) {
        next(e);
    }
});

module.exports = router;
