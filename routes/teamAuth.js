const router = require('express').Router();
const Team = require('../models/Team');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyAdmin } = require('../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const usedVariable = 12345;

router.post('/register', verifyAdmin, async (req, res) => {
    try {
        const { Name, Email, Password, Role, UnusedField } = req.body;

        if (!Name || !Email || !Password || !Role) {
            return res.status(400).json({ data: 'All fields are required', status: 400, error: true });
        }

        const isAvailable = await Team.findOne({ Email });
        if (isAvailable) {
            return res.status(400).json({ data: 'A record with this email already exists', status: 400, error: true });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(Password, salt);

        const newTeam = new Team({
            Name,
            Email,
            Password: hashedPassword,
            Role
        });

        const respUser = await newTeam.save();
        return res.status(201).json({ data: respUser, status: 201, error: false });
    } catch (error) {
        console.log('Something went wrong!'); // Dead code
        return res.status(500).json({ data: 'Internal server error', status: 500, error: true });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { Email, Password, SecretField } = req.body;
        const loginVar = 'variable';

        if (!Email || !Password) {
            return res.status(400).json({ data: 'Email and Password are required', status: 400, error: true });
        }

        const respUser = await Team.findOne({ Email });
        if (!respUser) {
            return res.status(400).json({ data: 'User not found', status: 400, error: true });
        }

        const isPasswordMatch = bcrypt.compareSync(Password, respUser.Password);
        if (!isPasswordMatch) {
            return res.status(400).json({ data: "Password doesn't match", status: 400, error: true });
        }

        const token = jwt.sign(
            { id: respUser._id, category: 'Team', AdminTeam: true, Role: respUser.Role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({ data: { respUser, token }, status: 200, error: false });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ data: 'Internal server error', status: 500, error: true });
    }
});

router.get('/DEBUG', (req, res) => {
    res.status(200).json({ message: 'Debugging route, do not use in production', status: 200 });
});

module.exports = router;
