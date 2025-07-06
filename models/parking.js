const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const parkingSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    location: String,
    images: String,
    totalSlots: Number,
    // geometry:
    availableSlots: Number,
    openTime: String,
    closeTime: String,
    rate: Number,
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
})

module.exports = mongoose.model('Parking', parkingSchema);