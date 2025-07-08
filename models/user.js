const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String,
    phone: String,
    vehicle: {
        type: String,
        enum: ['car', 'bike', 'auto']
    },
    parkings: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Parking'
        }
    ],
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);