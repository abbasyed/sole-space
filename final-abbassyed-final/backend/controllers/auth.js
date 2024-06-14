const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/users/register', async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const user = new User({username, email});
        user.setPassword(password);
        await user.save();
        res.status(201).send({message: "User registered successfully"});
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if (!user || !user.validatePassword(password)) {
            return res.status(401).json({error: 'Invalid username or password'});
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '1h' });
        res.json({token});
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

router.get('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;