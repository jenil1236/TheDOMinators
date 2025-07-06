const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Parking = require('./models/parking');
const User = require('./models/user');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/Transport')
    .then(() => {
        console.log('Connected successfully');
    })
    .catch(e => {
        console.log('ERROR', e);
    })

app.get('/parkings', (req, res) => {
    res.render('parkings/home')
})

app.get('/parkings/login', (req, res) => {
    res.render('parkings/login');
})

app.get('/parkings/role/:id', (req, res) => {
    const { id } = req.params;
    res.render('parkings/role', { id });
})

app.get('/parkings/user/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate('parkings');
    const allParkings = await Parking.find();
    res.render('parkings/user', { user, allParkings });
})

app.get('/parkings/owner/:id', async (req, res) => {
    const { id } = req.params;
    const owner = await User.findById(id).populate('parkings');
    res.render('parkings/owner', { owner });
})

app.get('/parkings/owner/:id/new', (req, res) => {
    const { id } = req.params;
    res.render('parkings/new', { id });
})

app.get('/parkings/:id/book/:parkingId', async (req, res) => {
    const { id, parkingId } = req.params;
    const parking = await Parking.findById(parkingId);
    res.render('parkings/book', { parking });
})

app.post('/parkings', async (req, res) => {
    const { name, phone, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
        return res.send('User already registered!');
    const user = new User({ name, phone, email, password });
    await user.save();
    res.redirect(`/parkings/role/${user._id}`);
})

app.post('/parkings/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
        res.send('User Not Found');
    if (user.password === password)
        res.redirect(`/parkings/role/${user._id}`);
    else
        res.send('User Not Found!!');
})

app.post('/parkings/owner/:id/new', async (req, res) => {
    const { id } = req.params;
    const { name, location, totalSlots, availableSlots, rate, openTime, closeTime } = req.body;
    const parking = new Parking({ name, location, totalSlots, availableSlots, rate, openTime, closeTime });
    parking.owner = id;
    const owner = await User.findById( id );
    owner.parkings.push(parking._id);
    await parking.save();
    await owner.save();
    console.log(parking);
    res.redirect(`/parkings/owner/${ id }`);
})

app.post('/parkings/role/:id', (req, res) => {
    const { id } = req.params;
    const { isOwner } = req.body;
    if (isOwner === 'true')
        return res.redirect(`/parkings/owner/${id}`);
    else
        return res.redirect(`/parkings/user/${id}`);
})

// app.use((err, req, res, next) => {
//     const { message = 'Page Not Found', status = 404 } = err;
//     // err.message = message;
//     // err.status = status;
//     res.status(status).send(message);
// })

app.listen(PORT, () => {
    console.log(`Listening on sever ${PORT}`);
})