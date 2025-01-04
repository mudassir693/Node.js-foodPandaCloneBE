const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Resturants = require('../models/Resturant');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; 

router.post('/register', async (req, res) => {
    try {
        const { Name, Password, Address, PhoneNumber, Varified, CNIC, Foods } = req.body;

        if (!Name || !Password || !Address || !PhoneNumber || !Varified || !CNIC || !Foods) {
            return res.status(400).json({ data: 'All fields are required', status: 400, error: true });
        }

        const isRestAvailable = await Resturants.findOne({ PhoneNumber });
        if (isRestAvailable) {
            return res.status(400).json({ data: 'Phone number is already registered', status: 400, error: true });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(Password, salt);

        const newResturant = new Resturants({
            Name,
            Password: hashedPassword,
            Address,
            PhoneNumber,
            Varified,
            CNIC,
            Foods
        });

        const resp = await newResturant.save();
        return res.status(201).json({ data: resp, status: 201, error: false });
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

        const respUser = await Resturants.findOne({ PhoneNumber });
        if (!respUser) {
            return res.status(404).json({ data: 'Restaurant not found', status: 404, error: true });
        }

        const isPasswordMatch = bcrypt.compareSync(Password, respUser.Password);
        if (!isPasswordMatch) {
            return res.status(400).json({ data: 'Wrong Password', status: 400, error: true });
        }

        const token = jwt.sign(
            { id: respUser._id, category: 'Resturant', AdminTeam: false, Role: false },
            JWT_SECRET,
            { expiresIn: '7d' } // Token expiration to improve security
        );

        return res.status(200).json({ data: { respUser, token }, status: 200, error: false });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ data: 'Internal server error', status: 500, error: true });
    }
});

module.exports = router;
