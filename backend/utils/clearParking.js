const Meta = require('../models/meta');
const Parking = require('../models/parking');
const ParkingUser = require('../models/parkinguser');

async function clearParking() {
    const today = new Date().toDateString();

    let lastCleared = await Meta.findOne({ key: 'lastClearedDate' });

    if (!lastCleared || lastCleared.value !== today) {
        console.log('New day detected. Clearing parking users...');

        await Parking.updateMany({}, [
            { $set: { users: [], availableSlot: "$totalSlot" } }
        ]);
        await ParkingUser.updateMany({}, { $set: { parkings: [] } });

        if (lastCleared) {
            lastCleared.value = today;
            await lastCleared.save();
        } else {
            await Meta.create({ key: 'lastClearedDate', value: today });
        }

        console.log('Cleared parking users successfully.');
    } else {
        console.log('Same day. No need to clear.');
    }
}

module.exports = clearParking;