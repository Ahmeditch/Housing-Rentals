const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        min: [4, 'Too short, plz provide minimum 4 carachters'],
        max: [32, 'Too long']
    },
    email: {
        type: String,
        required: true,
        min: [4, 'Too short, plz provide minimum 4 carachters'],
        max: [32, 'Too long'],
        lowercase: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        min: [4, 'Too short, plz provide minimum 4 carachters'],
        max: [32, 'Too long'],
        lowercase: true,
        required: true,
    },
    rentals: [{
        type: Schema.Types.ObjectId,
        ref: 'Rental'
    }]
});

userSchema.methods.hasSamePassword = function(requestedPassword) {
    const user = this;
    return bcrypt.compareSync(requestedPassword, user.password);
    }

userSchema.pre('save', function(next) {
    const user = this;
    bcrypt.genSalt(8, function(err, salt) {
       var hash =  bcrypt.hashSync(user.password, salt)
            console.log(hash);
            user.password = hash;
           next();
    });
});
module.exports = mongoose.model('User', userSchema);