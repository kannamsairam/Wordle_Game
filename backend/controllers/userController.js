const User = require('../models/User');
const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); //For password recovery

const userService = require('../services/userService');
const GameService = require('../services/gameService'); // Import GameService

const crypto = require('crypto'); // For generating OTP

//Individual user registration
//Registration
exports.register = async (req, res) => {
    try {
        const user = await userService.register(req.body);
        res.status(200).json({ message: 'User registered succesfully', user});
        // const { Username, Email, Phone, Password } = req.body;
        
        // //Validate input
        // if(!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(Email)) {
        //     return res.status(400).json({ messsage: 'Invalid email format'});
        // }

        // //Hash password before saving
        // //const hashedPassword = await bcrypt.hash(Password, 10);

        // const hashedPassword = userService.hashPassword(Password);

        // const newUser = new User({
        //     Username, Email, Phone, Password: hashedPassword
        // });
        
        // await newUser.save();

        // res.status(200).json({ message: 'User registered succesfully'});
    } catch(error) {
        res.status(400).json({ message: 'Error registering user', error });
    }
};

//Individual user login
//Login
exports.login = async (req, res) => {
    try {
        const { Username, Password } = req.body;
        const user = await User.findOne({Username});

        //console.log(user.Password);
        
        //To compare user name and password
        //!(await bcrypt.compare(Password, user.Password)) 
        // if(!user || Password !== user.Password) {
        //     return res.status(401).json( {message: 'Invalid username or password'} );
        // }

        if(!user) {
            return res.status(401).json({ message: 'Invalid username' });
        }
        
        if(!(await bcrypt.compare(Password, user.Password))) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // if(Password !== user.Password) {
        //     return res.status(401).json({ message: 'Invalid password' });
        // }

        //Generate JWT Token
        // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        //     expiresIn: '1h',
        // });

        // After successful login, start a new game session for the user
        const gameSession = await GameService.startNewGame(user._id);

        res.json({ message: 'Login successful', gameSession });
    } catch (error) {
        res.status(400).json({ message: 'Error logging in', error });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { Email } = req.body;
        const user = await User.findOne({ Email });

        if(!user) return res.status(404).json({ message: 'User not found' });

        //Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        //Set OTP and expiration (e.g., valid for 10 minutes)
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now
        await user.save();

        // Send OTP via email
        await userService.sendOtpEmail(user.Email, otp);

        res.json({ message: 'OTP sent to your registered email' });
    } catch(error) {
        res.status(500).json({ message: 'Error in password recovery', error });
    }
}

// Validate OTP
exports.validateOtp = async (req, res) => {
    try {
        const { Email, otp } = req.body;
        const user = await User.findOne({ Email });

        if(!user || user.otp !== otp || user.otpExpires < Date.now()) res.status(400).json({ message: 'Invalid or expired OTP' });

        //OTP is valid; clear OTP fields and allow password reset
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.json({ message: 'OTP validated. You may now reset your password.' });
    } catch (error) {
        res.status(500).json({ message: 'Error validating OTP', error });
    }
};
 
//Reset Password
exports.resetPassword = async (req, res) => {
    try { 
        const { Email, newPassword } = req.body;
        const user = await User.findOne({ Email });

        if(!user) res.status(404).json({ message: 'User not found' });

        //Hash the new password and update the user record
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.Password = hashedPassword;
        await user.save();
        
        res.json({ message: 'Password reset successful, You can now login with your new password.' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error });
    }
};

// //Individual password recovery
// //Password Recovery
// exports.forgotPassword = async (req, res) => {
//     try {
//         const { Email } = req.body;
//         const user = await User.findOne({ Email });
        
//         if(!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         //Send email with the password
//         const transporter = userService.sendPasswordRecoveryEmail(user.Email, user.Password); //sending encrypted password.
//         // const transporter = nodemailer.createTransport({
//         //     service: 'gmail',
//         //     auth: {
//         //         user: process.env.EMAIL_USER,
//         //         pass: process.env.EMAIL_PASS
//         //     }
//         // });

//         // await transporter.sendMail({
//         //     from: process.env.EMAIL_USER,
//         //     to: Email,
//         //     subject: 'Your Password',
//         //     text: `Hello, your password is: ${user.Password}` 
//         // });

//         res.json({ message: 'Password sent to registered email', transporter });
//     } catch(error) {
//         res.status(500).json({ message: 'Error in password recovery', error });
//     }
// };