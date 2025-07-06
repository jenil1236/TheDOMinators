const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    parkings: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Parking'
        }
    ],
});

module.exports = mongoose.model('User', userSchema);