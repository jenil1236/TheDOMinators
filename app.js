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
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local')

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    req.isAdmin = req.session.isAdmin || false;
    res.locals.isAdmin = req.isAdmin;
    next();
})

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.session.isAdmin = false;
        res.locals.isAdmin = false;
        return next();
    }
    if (req.isAdmin) {
        return next();
    }
    next('unAuthenticated');
}

const isAdmin = (req, res, next) => {
    const adminKeys = process.env.ADMIN_KEYS.split(',');
    const { key } = req.body;
    if (key && adminKeys.includes(key)) {
        req.session.isAdmin = true;
        res.locals.isAdmin = true;
        return next();
    }
    next('unAuthenticated');
}

mongoose.connect('mongodb://127.0.0.1:27017/Transport')
    .then(() => {
        console.log('Connected successfully');
    })
    .catch(e => {
        console.log('ERROR', e);
    })

app.get('/register', (req, res) => {
    res.render('users/register');
})

app.get('/login', (req, res) => {
    res.render('users/login');
})

app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/register');
    })
})

app.get('/parkings', async (req, res) => {
    const allParkings = await Parking.find();
    res.render('parkings/role', { allParkings });
})

app.get('/parkings/user', isLoggedIn, async (req, res) => {
    const id = req.user._id;
    const user = await User.findById(id).populate('parkings');
    const allParkings = await Parking.find({ _id: { $nin: user.parkings } });
    res.render('parkings/user', { user, allParkings });
})

app.get('/parkings/owner', isLoggedIn, async (req, res) => {
    const id = req.user._id;
    const owner = await User.findById(id).populate('parkings');
    res.render('parkings/owner', { owner });
})

app.get('/parkings/owner/new', isLoggedIn, (req, res) => {
    res.render('parkings/new');
})

app.get('/parkings/user/:parkingId', isLoggedIn, async (req, res) => {
    const { parkingId } = req.params;
    const parking = await Parking.findById(parkingId).populate('owner');
    res.render('parkings/book', { parking });
})

app.get('/parkings/owner/:parkingId', isLoggedIn, async (req, res) => {
    const { parkingId } = req.params;
    const parking = await Parking.findById(parkingId).populate('users.user').populate('owner');
    res.render('parkings/details', { parking });
})
app.get('/parkings/owner/:parkingId/edit', isLoggedIn, async (req, res) => {
    const { parkingId } = req.params;
    const parking = await Parking.findById(parkingId);
    res.render('parkings/update', { parking })
})


app.post('/register', async (req, res, next) => {
    try {
        const { name, phone, email, password, username } = req.body;
        const newUser = new User({ name, phone, email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err)
                return next(err);

            res.redirect('/parkings');
        })
    }
    catch (e) {
        res.redirect('/register');
    }
})

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), async (req, res) => {
    res.redirect('/parkings');
})

app.post('/parkings/owner/new', isLoggedIn, async (req, res) => {
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


app.post('/parkings/user/:parkingId', isLoggedIn, async (req, res) => {
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

app.post('/parkings', isLoggedIn, (req, res) => {
    const id = req.user._id;
    const { isOwner } = req.body;
    if (isOwner === 'true')
        return res.redirect(`/parkings/owner`);
    else
        return res.redirect(`/parkings/user`);
})

app.put('/parkings/owner/:parkingId', isLoggedIn, async (req, res) => {
    const { parkingId } = req.params;
    const { location } = req.body;
    const parking = await Parking.findOneAndUpdate({ _id: parkingId }, req.body, { new: true, runValidators: true });
    const geoData = await maptilerClient.geocoding.forward(location, { limit: 1 });
    parking.geometry = geoData.features[0].geometry;
    await parking.save();
    res.redirect(`/parkings/owner/${parkingId}`);
})

app.delete('/parkings/user/:parkingId', isLoggedIn, async (req, res) => {
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

app.delete('/parkings/owner/:parkingId', isLoggedIn, async (req, res) => {
    const { parkingId } = req.params;
    const parking = await Parking.findById(parkingId);
    await User.updateMany({ _id: { $in: parking.users } }, { $pull: { parkings: parkingId } });
    await parking.deleteOne();
    if (req.isAdmin)
        return res.redirect('/parkings');
    res.redirect(`/parkings/owner`);
})

app.delete('/parkings/owner/:parkingId/:userId', isLoggedIn, async (req, res) => {
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

// ADMIN ROUTES
app.get('/admin/login', (req, res) => {
    res.render('users/admin_login')
})

app.get('/admin/dashboard', (req, res) => {
    if (!req.isAdmin)
        return res.redirect('/admin/login');
    res.render('users/admin');
})

app.get('/admin/logout', (req, res) => {
    req.session.isAdmin = false;
    req.isAdmin = false;
    res.locals.isAdmin = false;
    res.redirect('/admin/login');
})

app.post('/admin/dashboard', isAdmin, (req, res) => {
    res.redirect('/admin/dashboard');
})

app.use((err, req, res, next) => {
    if (err == 'unAuthenticated')
        return res.redirect('/login');
    const { message = 'Page Not Found', status = 404 } = err;
    // err.message = message; 
    // err.status = status;
    res.status(status).send(message);
})

app.get('/users', async (req, res) => {
    if (!req.isAdmin)
        return res.redirect('/admin/login');
    const users = await User.find();
    res.render('users/users', { users });
})

app.delete('/users/:id', async (req, res) => {
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
    res.redirect('/users');
})

app.listen(PORT, () => {
    console.log(`Listening on sever ${PORT}`);
})