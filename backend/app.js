if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const maptilerClient = require("@maptiler/client");
const cors = require('cors');

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

const User = require('./models/user');

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local')

const parkingsUserRoutes = require('./routes/ParkingRoutes/parkingsUserRoutes')
const parkingsOwnerRoutes = require('./routes/ParkingRoutes/parkingsOwnerRoutes')
const adminRoutes = require('./routes/AdminRoutes/adminRoutes')
const parkingRoutes = require('./routes/ParkingRoutes/parkingRoutes');

const clearParking = require('./utils/clearParking');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", // your Vite frontend
    credentials: true//allow use of cookies
}));//Make sure both Express and React allow credentials (cookies) for session authentication to work across origins.

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
    // res.locals.currentUser = req.user;
    req.isAdmin = req.session.isAdmin || false;
    // res.locals.isAdmin = req.isAdmin;
    next();
})
// Auth status route
app.get('/api/auth/me', (req, res) => {
    if(req.isAdmin)
        return res.json({ isAdmin: req.isAdmin })
    else if (!req.isAuthenticated()) {
        return res.status(401).json({ user: null, isAdmin: false });
    }
    res.json({
        user: {
            id: req.user._id,
            name: req.user.name,
            phone: req.user.phone,
            username: req.user.username,
            email: req.user.email,
        },
        isAdmin: req.isAdmin
    });
});

app.use('/parkings/:subroute', (req, res, next) => {
    req.parkinguserId = req.session.parkinguserId;
    next();
})

mongoose.connect('mongodb://127.0.0.1:27017/Transport')
    .then(async () => {
        console.log('Connected successfully');
        await clearParking();
    })
    .catch(e => {
        console.log('ERROR', e);
    })

app.use('/', parkingRoutes);
app.use('/admin', adminRoutes);
app.use('/parkings/user', parkingsUserRoutes);
app.use('/parkings/owner', parkingsOwnerRoutes);

// app.use((err, req, res, next) => {
//     if (err == 'unAuthenticated')
//         return res.redirect('/login');
//     const { message = 'Page Not Found', status = 404 } = err;
//     res.status(status).send(message);
// })
// page not found error handles in frontend
// <Route path="*" element={<div>404 - Page Not Found</div>} />

app.listen(PORT, () => {
    console.log(`Listening on sever ${PORT}`);
})