if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const Parking = require('./models/parking');
const User = require('./models/user');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

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

app.get('/parkings/user/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate('parkings');
    const allParkings = await Parking.find({ _id: { $nin: user.parkings } });
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

app.get('/parkings/user/:id/:parkingId', async (req, res) => {
    const { id, parkingId } = req.params;
    const parking = await Parking.findById(parkingId).populate('owner');
    res.render('parkings/book', { id, parking });
})

app.get('/parkings/owner/:id/:parkingId', async (req, res) => {
    const { id, parkingId } = req.params;
    const parking = await Parking.findById(parkingId).populate('users.user').populate('owner');
    res.render('parkings/details', { id, parking });
})
app.get('/parkings/owner/:id/:parkingId/edit', async (req, res) => {
    const { id, parkingId } = req.params;
    const parking = await Parking.findById(parkingId);
    res.render('parkings/update', { id, parking })
})

app.get('/parkings/:id', (req, res) => {
    const { id } = req.params;
    res.render('parkings/role', { id });
})

app.post('/parkings', async (req, res) => {
    const { name, phone, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
        return res.send('User already registered!');
    const user = new User({ name, phone, email, password });
    await user.save();
    res.redirect(`/parkings/${user._id}`);
})

app.post('/parkings/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
        res.send('User Not Found');
    if (user.password === password)
        res.redirect(`/parkings/${user._id}`);
    else
        res.send('User Not Found!!');
})

app.post('/parkings/owner/:id/new', async (req, res) => {
    const { id } = req.params;
    const { name, location, totalSlots, availableSlots, rate, openTime, closeTime } = req.body;
    const parking = new Parking({ name, location, totalSlots, availableSlots, rate, openTime, closeTime });
    parking.owner = id;
    const geoData = await maptilerClient.geocoding.forward(location, { limit: 1 });
    parking.geometry = geoData.features[0].geometry;
    const owner = await User.findById(id);
    owner.parkings.push(parking._id);
    await parking.save();
    await owner.save();
    res.redirect(`/parkings/owner/${id}`);
})


app.post('/parkings/user/:id/:parkingId', async (req, res) => {
    const { id, parkingId } = req.params;
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
    res.redirect(`/parkings/user/${user._id}`);
})

app.post('/parkings/:id', (req, res) => {
    const { id } = req.params;
    const { isOwner } = req.body;
    if (isOwner === 'true')
        return res.redirect(`/parkings/owner/${id}`);
    else
        return res.redirect(`/parkings/user/${id}`);
})

app.put('/parkings/owner/:id/:parkingId', async (req, res) => {
    const { id, parkingId } = req.params;
    const { name, location, totalSlots, availableSlots, rate, openTime, closeTime } = req.body;
    const parking = await Parking.findOneAndUpdate({ _id: parkingId }, req.body, { new: true, runValidators: true });
    const geoData = await maptilerClient.geocoding.forward(location, { limit: 1 });
    parking.geometry = geoData.features[0].geometry;
    res.redirect(`/parkings/owner/${id}/${parkingId}`);
})

app.delete('/parkings/user/:id/:parkingId', async (req, res) => {
    const { id, parkingId } = req.params;
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
    res.redirect(`/parkings/user/${id}`);
})

app.delete('/parkings/owner/:id/:parkingId', async (req, res) => {
    const { id, parkingId } = req.params;
    const parking = await Parking.findById(parkingId);
    await User.updateMany({ _id: { $in: parking.users } }, { $pull: { parkings: parkingId } });
    await parking.deleteOne();
    res.redirect(`/parkings/owner/${id}`);
})

app.delete('/parkings/owner/:id/:parkingId/:userId', async (req, res) => {
    const { id, parkingId, userId } = req.params;
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
    res.redirect(`/parkings/owner/${id}/${parkingId}`);
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