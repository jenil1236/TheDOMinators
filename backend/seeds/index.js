import mongoose from 'mongoose';
import Parking from '../models/parking.js';
import User from '../models/user.js';
import ParkingUser from '../models/parkinguser.js';
import parkingData from './cities.js';
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
    if (!owner) {
        console.log('owner not found')
        process.exit(1);
    }
    else {
        console.log(owner);
    }
    for (const data of parkingData) {
        const parking = new Parking({
            ...data,
            owner: owner._id
        });
        await parking.save();
        parkingowner.parkings.push(parking._id);
    }
    await parkingowner.save();
}
seedDB().then(() => { db.close() })


