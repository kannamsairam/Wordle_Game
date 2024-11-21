const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/User');

exports.register = async (userData) => {
      const { Username, Email, Phone, Password } = userData;
      
      //Validate input
      if(!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(Email)) {
        return res.status(400).json({ messsage: 'Invalid email format'});
      }

      //Hash password before saving
      //const hashedPassword = await bcrypt.hash(Password, 10);

      //const hashedPassword = userService.hashPassword(Password);

      const hashedPassword = await hashPassword(Password);

      const newUser = new User({
          Username, Email, Phone, Password: hashedPassword
      });
      
      return await newUser.save();
      //res.status(200).json({ message: 'User registered succesfully'});
};

// exports.hashPassword = async (password) => {
//   return await bcrypt.hash(password, 10);
// };

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
};

exports.sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
});

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'OTP for Password Reset',
    text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
  });
};

// exports.sendPasswordRecoveryEmail = async (email, password) => {
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
// });

//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'Your Password',
//     text: `Hello, your password is: ${password}`,
//   });
// };