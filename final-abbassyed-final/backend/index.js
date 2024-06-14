const express = require('express');
const app = express();
const mongoose = require('mongoose');
const shoeRouter = require('./controllers/shoes');
const authRouter = require('./controllers/auth');
const path = require('path');
const cors = require('cors');
const axios = require('axios');


app.use(cors());

app.use(express.static('dist'))

const assetsPath = path.join(__dirname, 'assets');
app.use('/assets', express.static(assetsPath));
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

app.use(express.json());

app.use('/api', shoeRouter);

app.use('/api/auth', authRouter);

app.get('/ebay-data', async (req, res) => {
    const { keywords } = req.query; // Get the shoe model from the query parameters
    try {
        const response = await axios.get('https://svcs.ebay.com/services/search/FindingService/v1', {
            params: {
                'X-EBAY-SOA-OPERATION-NAME': 'findItemsByKeywords',
                'OPERATION-NAME': 'findItemsByKeywords',
                'SECURITY-APPNAME': 'AbbasSye-JordanSh-PRD-ee1d2d212-8b7db400',
                'RESPONSE-DATA-FORMAT': 'JSON',
                'keywords': keywords // Use the shoe model dynamically
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
