import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    // name: String,
    email: String,
    // phone: String
});

userSchema.plugin(passportLocalMongoose);
export default mongoose.model('User', userSchema);