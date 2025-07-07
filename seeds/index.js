const mongoose = require('mongoose');
const Parking = require('../models/parking');
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
            owner: '686a98ebfc8896b7f6a44699',
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random162].lng,
                    cities[random162].lat 
                ]
            },
        });
        await parking.save();
    }
}
seedDB().then(() => { db.close() })


