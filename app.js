if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const User = require('./models/user');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const parkingsUserRoutes = require('./routes/parkingsUserRoutes')
const parkingsOwnerRoutes = require('./routes/parkingsOwnerRoutes')
const adminRoutes = require('./routes/adminRoutes')
const routes = require('./routes/routes');

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

mongoose.connect('mongodb://127.0.0.1:27017/Transport')
    .then(() => {
        console.log('Connected successfully');
    })
    .catch(e => {
        console.log('ERROR', e);
    })

app.use('/', routes);
app.use('/admin', adminRoutes);
app.use('/parkings/user', parkingsUserRoutes);
app.use('/parkings/owner', parkingsOwnerRoutes);

app.use((err, req, res, next) => {
    if (err == 'unAuthenticated')
        return res.redirect('/login');
    const { message = 'Page Not Found', status = 404 } = err;
    // err.message = message; 
    // err.status = status;
    res.status(status).send(message);
})

app.listen(PORT, () => {
    console.log(`Listening on sever ${PORT}`);
})