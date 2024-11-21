const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Username: { 
        type: String, 
        unique: true, 
        required: true, 
        trim: true 
    },
    Email: { 
        type: String, 
        unique: true, 
        required: true,
       // match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email format']
    },
    Password: { 
        type: String, 
        require: true 
    },
    Phone: { 
        type: String, 
        require: false 
    },
    otp: String,     // OTP for password reset
    otpExpires: Date // Expiration time for the OTP
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema, 'Users');