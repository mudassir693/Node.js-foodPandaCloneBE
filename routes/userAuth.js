const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; 

router.post('/register', async (req, res) => {
    try {
        const { Name, Password, Address, PhoneNumber, Email } = req.body;

        if (!Name || !Password || !PhoneNumber || !Email) {
            return res.status(400).json({ data: 'All fields are required', status: 400, error: true });
        }

        const isUserAvailable = await User.findOne({ PhoneNumber });
        if (isUserAvailable) {
            return res.status(400).json({ data: 'This record is already registered', status: 400, error: true });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(Password, salt);

        const newUser = new User({
            Name,
            Password: hashedPassword,
            Address,
            PhoneNumber,
            Email
        });

        const respUser = await newUser.save();
        return res.status(201).json({ data: respUser, status: 201, error: false });
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ data: 'Internal server error', status: 500, error: true });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { PhoneNumber, Password } = req.body;

        if (!PhoneNumber || !Password) {
            return res.status(400).json({ data: 'PhoneNumber and Password are required', status: 400, error: true });
        }

        const isUserAvailable = await User.findOne({ PhoneNumber });
        if (!isUserAvailable) {
            return res.status(400).json({ data: 'User not found', status: 400, error: true });
        }

        const isPasswordMatch = bcrypt.compareSync(Password, isUserAvailable.Password);
        if (!isPasswordMatch) {
            return res.status(400).json({ data: 'Wrong password', status: 400, error: true });
        }

        const token = jwt.sign(
            {
                id: isUserAvailable._id,
                category: 'User',
                AdminTeam: false,
                Role: false,
            },
            JWT_SECRET,
            { expiresIn: '7d' } 
        );

        return res.status(200).json({ data: { user: isUserAvailable, token }, status: 200, error: false });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ data: 'Internal server error', status: 500, error: true });
    }
});

module.exports = router;
