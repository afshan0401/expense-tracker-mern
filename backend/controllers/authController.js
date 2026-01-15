const User = require('../models/User');
const bcrypt = require("bcryptjs");

const jwt = require('jsonwebtoken');


//Genrate JWT token
const generateToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {
        expiresIn: '1h'});

}

//register user

exports.registerUser = async (req, res) => {
    const {fullName, email, password, profileImageUrl} = req.body || {};

    if(!fullName || !email || !password) {
        return res.status(400).json({message: 'Please provide all required fields'});
    }

    try{
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }

        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });

        await user.save();

        
        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (error) {
        // console.error('Error registering user:', error.stack);
        res.status(500).json({message: error.message});
    }
}


//login user
// exports.loginUser = async (req, res) => {
    
//     const {email, password} = req.body || {};
//     if(!email || !password) {
//         return res.status(400).json({message: 'Please provide all required fields'});
//     }
//     try {
//         const user = await User.findOne({email});
//         if(!user) {
//             return res.status(400).json({message: 'Invalid email or password'});
//         }
//         res.status(200).json({
//             id: user._id,
//             user,
//             token: generateToken(user._id),
//         });
//     } catch (error) {
//         // console.error('Error logging in user:', error.stack);
//         res.status(500).json({message: error.message});
//     }


// }


exports.loginUser = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};





//get user info 
exports.getUserInfo = async (req, res) => {
    // Registration logic here
    try {
        const user = await User.findById(req.user.id).select('-password');
        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json(user);
    } catch (error) {
        // console.error('Error getting user info:', error.stack);
        res.status(500).json({message: error.message});
    }
}