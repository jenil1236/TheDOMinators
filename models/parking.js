const mongoose = require('mongoose');
const opts = { toJSON: { virtuals: true } };
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
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }, 
    availableSlots: Number,
    openTime: String,
    closeTime: String,
    rate: Number,
    users: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            vehicle: {
                type: String,
                enum: ['car', 'auto', 'bike'],
            }
        }
    ],
}, opts)
parkingSchema.virtual('properties.popUpMarkup').get(function() {
    const safeId = this.location.toLowerCase().replace(/,/g, '').replace(/\s+/g, '-');
    return `<strong><a href="#${safeId}">${this.name}</a></strong>
    <p>${this.location}</p>`
})
module.exports = mongoose.model('Parking', parkingSchema);