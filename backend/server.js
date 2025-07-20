import 'dotenv/config'; 

import express from 'express';
import mongoose from 'mongoose';
import * as maptilerClient from '@maptiler/client';
import cors from 'cors';

import User from './models/user.js';

import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';

import parkingsUserRoutes from './routes/ParkingRoutes/parkingsUserRoutes.js';
import parkingsOwnerRoutes from './routes/ParkingRoutes/parkingsOwnerRoutes.js';
import adminRoutes from './routes/AdminRoutes/adminRoutes.js';
import parkingRoutes from './routes/ParkingRoutes/parkingRoutes.js';

import clearParking from './utils/clearParking.js';

const app = express();
const PORT = 5000;

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
    httpOnly: true,
    secure: false,  // true if using HTTPS in production
    maxAge: 1000 * 60 * 60 * 24, // 1 day for example
  },
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    req.isAdmin = req.session.isAdmin || false;
    next();
});

app.get('/api/auth/me', (req, res) => {
    if(req.isAdmin)
        return res.json({ isAdmin: req.isAdmin });
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

app.use('/api/parkings/:subroute', (req, res, next) => {
    req.parkinguserId = req.session.parkinguserId;
    next();
});

mongoose.connect('mongodb://127.0.0.1:27017/Transport')
    .then(async () => {
        console.log('Connected successfully');
        await clearParking();
    })
    .catch(e => {
        console.log('ERROR', e);
    });

app.use('/api', parkingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/parkings/user', parkingsUserRoutes);
app.use('/api/parkings/owner', parkingsOwnerRoutes);

app.listen(PORT, () => {
    console.log(`Listening on server ${PORT}`);
});
