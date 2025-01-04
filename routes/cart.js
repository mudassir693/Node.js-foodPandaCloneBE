const router = require('express').Router();
const Cart = require('../models/Cart');
const { verifyAdminAndUser, verifyAdmin } = require('../middleware/authMiddleware');

router.post("/add/:id", verifyAdminAndUser, async (req, res) => {
    const { UserId, Foods, ...other } = req.body;
    const userIdFromParam = req.params.id;

    if (!UserId || !Foods) {
        return res.status(400).json({ data: 'UserId and Foods are required', error: true, status: 400 });
    }

    if (userIdFromParam !== UserId) {
        return res.status(403).json({ data: 'UserId mismatch', error: true, status: 403 });
    }

    try {
        const cart = await Cart.findOne({ UserId: userIdFromParam });
        if (cart) {
            const updatedCart = await Cart.findByIdAndUpdate(cart._id, { $set: other }, { new: true });
            return res.status(200).json({ data: updatedCart, status: 200, error: false });
        }

        const newCart = new Cart({ UserId, Foods });
        const savedCart = await newCart.save();
        return res.status(201).json({ data: savedCart, status: 201, error: false });

    } catch (error) {
        return res.status(500).json({ data: error.message, status: 500, error: true });
    }
});

router.get('/get', verifyAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        return res.status(200).json({ data: carts, status: 200, error: false });
    } catch (error) {
        return res.status(500).json({ data: error.message, status: 500, error: true });
    }
});

router.get('/getByUser/:uid', verifyAdminAndUser, async (req, res) => {
    try {
        const cart = await Cart.find({ UserId: req.params.uid });
        if (!cart.length) {
            return res.status(404).json({ data: 'No cart found for this user', status: 404, error: true });
        }
        return res.status(200).json({ data: cart, status: 200, error: false });
    } catch (error) {
        return res.status(500).json({ data: error.message, status: 500, error: true });
    }
});

router.get('/get/:id', verifyAdminAndUser, async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        if (!cart) {
            return res.status(404).json({ data: 'Cart not found', status: 404, error: true });
        }
        return res.status(200).json({ data: cart, status: 200, error: false });
    } catch (error) {
        return res.status(500).json({ data: error.message, status: 500, error: true });
    }
});

router.delete('/delete/:id', verifyAdmin, async (req, res) => {
    try {
        const cart = await Cart.findByIdAndDelete(req.params.id);
        if (!cart) {
            return res.status(404).json({ data: 'Cart not found', status: 404, error: true });
        }
        return res.status(200).json({ data: 'Cart deleted successfully', status: 200, error: false });
    } catch (error) {
        return res.status(500).json({ data: error.message, status: 500, error: true });
    }
});

module.exports = router;
