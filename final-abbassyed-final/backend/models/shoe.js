require("dotenv").config();
const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB_URI;
console.log("MongoURI:", mongoURI);

mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(error => console.error("Error connecting to MongoDB:", error));

const ratingSchema = new mongoose.Schema({
    rating: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const shoeSchema = new mongoose.Schema({
    brand: {
        type: String,
        default: 'Nike'
    },
    model: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    designer: {
        type: String,
        required: true
    },
    releaseYear: {
        type: String,
        required: true
    },
    originalPrice: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['men', 'women', 'kids']
    },
    image: {
        type: String,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    ratings: [ratingSchema]
});
shoeSchema.pre('save', function (next) {
    const err = this.validateSync();
    if (err) {
        console.error('Error validating shoe:', err.message);
        return next(err);
    }
    next();
});

shoeSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Shoe = mongoose.model("Shoe", shoeSchema);

module.exports = Shoe;