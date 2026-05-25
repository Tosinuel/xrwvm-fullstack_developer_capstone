const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3030;

// Middleware
app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));

// Load JSON data
const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

// Database connection
mongoose.connect("mongodb://mongo_db:27017/", { 'dbName': 'dealershipsDB' });

// Import models
const Reviews = require('./review');
const Dealerships = require('./dealership');

// Initialize database with seed data
const initializeDatabase = async () => {
    try {
        await Reviews.deleteMany({});
        await Reviews.insertMany(reviews_data.reviews);
        
        await Dealerships.deleteMany({});
        await Dealerships.insertMany(dealerships_data.dealerships);
        
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

initializeDatabase();

// =============================================================================
// ROUTES
// =============================================================================

// Home route
app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API");
});

// Fetch all reviews
app.get('/fetchReviews', async (req, res) => {
    try {
        const documents = await Reviews.find();
        res.json(documents);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Error fetching documents' });
    }
});

// Fetch reviews by dealer ID
app.get('/fetchReviews/dealer/:id', async (req, res) => {
    try {
        const documents = await Reviews.find({ dealership: req.params.id });
        res.json(documents);
    } catch (error) {
        console.error('Error fetching reviews by dealer:', error);
        res.status(500).json({ error: 'Error fetching documents' });
    }
});

// Fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
    try {
        const documents = await Dealerships.find();
        res.json(documents);
    } catch (error) {
        console.error('Error fetching dealerships:', error);
        res.status(500).json({ error: 'Error fetching dealerships' });
    }
});

// Fetch dealerships by state
app.get('/fetchDealers/:state', async (req, res) => {
    try {
        const { state } = req.params;
        const documents = await Dealerships.find({ state: state });
        
        if (documents.length > 0) {
            res.json(documents);
        } else {
            res.status(404).json({ error: `No dealerships found in ${state}` });
        }
    } catch (error) {
        console.error('Error fetching dealerships by state:', error);
        res.status(500).json({ error: 'Error fetching dealerships by state' });
    }
});

// Fetch dealer by ID
app.get('/fetchDealer/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const document = await Dealerships.findOne({ id: id });
        
        if (document) {
            res.json(document);
        } else {
            res.status(404).json({ error: `Dealer not found with id: ${id}` });
        }
    } catch (error) {
        console.error('Error fetching dealer by id:', error);
        res.status(500).json({ error: 'Error fetching dealer by id' });
    }
});

// Insert new review
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
    try {
        const data = JSON.parse(req.body);
        const documents = await Reviews.find().sort({ id: -1 });
        
        // Generate new ID
        const newId = documents.length > 0 ? documents[0].id + 1 : 1;
        
        const review = new Reviews({
            "id": newId,
            "name": data.name,
            "dealership": data.dealership,
            "review": data.review,
            "purchase": data.purchase,
            "purchase_date": data.purchase_date,
            "car_make": data.car_make,
            "car_model": data.car_model,
            "car_year": data.car_year,
        });
        
        const savedReview = await review.save();
        res.json(savedReview);
        
    } catch (error) {
        console.error('Error inserting review:', error);
        res.status(500).json({ error: 'Error inserting review' });
    }
});

// =============================================================================
// START SERVER
// =============================================================================

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});