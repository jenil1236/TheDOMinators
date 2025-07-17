const mongoose = require('mongoose');
const Parking = require('../models/parking');
const User = require('../models/user');
const ParkingUser = require('../models/parkinguser');
const cities = require('./cities');
const dbUrl = 'mongodb://127.0.0.1:27017/Transport';

mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('Connection established');
});


const seedDB = async () => {
    await Parking.deleteMany({});
    const owner = await User.findById('68792d30a28a85634db05dfe');
    const parkingowner = await ParkingUser.findOne({ user: owner._id });
    if(!owner) {
        console.log('owner not found')
        process.exit(1);
    }
    else{
        console.log(owner);
    }
    for (let i = 0; i < 100; i++) {
        const random162 = Math.floor(Math.random() * 162);
        const rate = Math.floor(Math.random() * 20 + 10);
        const parking = new Parking({
            location: `${cities[random162].city}, ${cities[random162].admin_name}`,
            name: 'Random',
            rate: rate,
            totalSlots: 10,
            availableSlots: 10,
            openTime: '12:30',
            closeTime: '23:30',
            owner: owner._id,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random162].lng,
                    cities[random162].lat 
                ]
            },
        });
        await parking.save();
        parkingowner.parkings.push(parking._id);
    }
    await parkingowner.save();
}
seedDB().then(() => { db.close() })


