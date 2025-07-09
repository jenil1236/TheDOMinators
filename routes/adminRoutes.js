const express = require('express');
const User = require('../models/user');
const Parking = require('../models/parking');
const { isAdmin } = require('../middleware');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('users/admin_login')
})

router.get('/dashboard', (req, res) => {
    if (!req.isAdmin)
        return res.redirect('/admin/login');
    res.render('users/admin');
})

router.get('/logout', (req, res) => {
    req.session.isAdmin = false;
    req.isAdmin = false;
    res.locals.isAdmin = false;
    res.redirect('/admin/login');
})

router.post('/dashboard', isAdmin, (req, res) => {
    res.redirect('/admin/dashboard');
})

router.get('/users', async (req, res) => {
    if (!req.isAdmin)
        return res.redirect('/admin/login');
    const users = await User.find();
    res.render('users/users', { users });
})

router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    await Parking.deleteMany({ owner: id });

    const user = await User.findById(id).populate('parkings');
    const parkings = user.parkings;

    for (const parking of parkings) {
        const userEntry = parking.users.find(entry => entry.user.equals(id));

        if (userEntry.vehicle === 'car') parking.availableSlots += 4;
        else if (userEntry.vehicle === 'auto') parking.availableSlots += 3;
        else parking.availableSlots += 2;

        parking.users = parking.users.filter(entry => !entry.user.equals(id));

        await parking.save();
    }
    await User.deleteOne({ _id: id });
    res.redirect('/admin/users');
})

module.exports = router;