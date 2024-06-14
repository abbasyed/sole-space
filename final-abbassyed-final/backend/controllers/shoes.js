const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Shoe = require('../models/shoe');
const Comment = require('../models/comments');
const secret = process.env.SECRET;
const expressJwt = require('express-jwt');



const storage = multer.diskStorage({
    destination: path.join(__dirname, '..', 'assets'),
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});


const requireAuth = expressJwt({
    secret: secret,
    algorithms: ['HS256'],
    userProperty: 'auth'
});

const upload = multer({storage: storage});

router.post('/shoes', upload.single('image'), async (req, res) => {
    try {
        const {brand, model, description, designer, releaseYear, originalPrice, category} = req.body;

        let imagePath;
        if (req.file) {
            imagePath = `/assets/${req.file.filename}`;
        }

        const newShoe = new Shoe({
            brand,
            model,
            description,
            designer,
            releaseYear,
            originalPrice,
            category,
            image: imagePath
        });

        const savedShoe = await newShoe.save();
        res.status(201).json(savedShoe);
    } catch (error) {
        console.error('Error saving shoe:', error);
        if (req.file) {
            fs.unlinkSync(path.join('./backend/assets', req.file.filename));
        }
        res.status(500).json({error: 'Internal server error'});
    }
});

router.get('/shoes', async (req, res) => {
    try {
        const shoes = await Shoe.find({});
        res.json(shoes);
    } catch (error) {
        console.error('Error fetching shoes:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

router.get('/shoes/:id', async (req, res) => {
    try {
        const shoe = await Shoe.findById(req.params.id);

        if (!shoe) {
            return res.status(404).json({error: 'Shoe not found'});
        }

        res.json(shoe);
    } catch (error) {
        console.error('Error fetching shoe:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

router.post('/shoes/:shoeId/comments', requireAuth, async (req, res) => {
    try {
        const {content} = req.body;
        const shoeId = req.params.shoeId;
        const author = req.auth.userId;

        const shoe = await Shoe.findById(shoeId);
        if (!shoe) {
            return res.status(404).json({error: 'Shoe not found'});
        }

        const newComment = new Comment({
            content,
            author,
            shoeId
        });

        const savedComment = await newComment.save();
        shoe.comments.push(savedComment._id);
        await shoe.save();

        res.status(201).json(savedComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

router.get('/shoes/:shoeId/comments', async (req, res) => {
    try {
        const shoeId = req.params.shoeId;
        const populate = req.query.populate;

        // Set populate options based on the query parameter
        const populateOptions = populate === 'author' ? { path: 'author', select: 'username' } : null;

        // Fetch comments with or without population
        const query = Comment.find({ shoeId });
        if (populateOptions) {
            query.populate(populateOptions);
        }

        const comments = await query.exec();

        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/shoes/comments/:commentId', async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const populate = req.query.populate;

        const populateOptions = populate === 'author' ? { path: 'author', select: 'username' } : null;

        const query = Comment.findById(commentId);
        if (populateOptions) {
            query.populate(populateOptions);
        }

        const comment = await query.exec();
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        res.json(comment);
    } catch (error) {
        console.error('Error fetching comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/shoes/:id/rating', requireAuth, async (req, res) => {
    try {
        const shoeId = req.params.id;
        const {rating} = req.body;

        const shoe = await Shoe.findById(shoeId);
        if (!shoe) {
            return res.status(404).json({error: 'Shoe not found'});
        }

        const newRating = {
            rating,
        };

        shoe.ratings.push(newRating);

        const updatedShoe = await shoe.save();

        res.json(updatedShoe);
    } catch (error) {
        console.error('Error submitting rating:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

module.exports = router;