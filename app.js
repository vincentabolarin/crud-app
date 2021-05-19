const express = require('express');
const app = express();

const PORT = process.env.PORT || 4001;

// Setting up Mongoose.
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zuriCluster';

app.use(express.json());

// Connecting app to database.
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connection to database successful.')
    }
});

// Creating Schema
const infoAppSchema = new mongoose.Schema({
    name: String,
    email: String,
    country: String
});
const Detail = mongoose.model('Detail', infoAppSchema);

// POST request to /details create new data.
app.post('/details', (req, res) => {
    // Retrieve new data details from req.body.
    // const detail = req.body.detail;

    // Create a new detail and save it to database.
    Detail.create({
        name: req.body.name,
        email: req.body.email,
        country: req.body.country
    }, (err, newDetail) => {
        if (err) {
            return res.status(500).json({message: err});
        } else {
            return res.status(200).json({message: "New detail created.", newDetail});
        }
    })
});

// // GET request to /details to fetch all data.
app.get('/details', (req, res) => {
    // Fetch all details.
    Detail.find({}, (err, detail) => {
        if (err) {
            return res.status(500).json({message: err});
        } else {
            return res.status(200).json(detail);
        }
    });

    // Send response to client.
})

// GET request to /details/:id to fetch a single data.
app.get('/details/:id', (req, res) => {
    Detail.findById(req.params.id, (err, detail) => {
        if (err) {
            return res.status(500).json({message: err});
        } else if (!detail) {
            res.status(404).json({message: "Detail not found."})
        } else {
            return res.status(200).json({detail});
        }
    });
});

// // PUT request to /details/:id to update a single data.
app.put('/details/:id', (req, res) => {
    Detail.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        country: req.body.country
    }, (err, detail) => {
        if (err) {
            return res.status(500).json({message: err});
        } else if (!detail) {
            return res.status(404).json({message: "Detail not found."})
        } else {
            detail.save((err, savedDetail) => {
                if (err) {
                    return res.status(400).json({message: err});
                } else {
                    return res.status(200).json({message: "Detail updated successfully."})
                }
            });
        }
    })
})

// // DELETE request to /details/:id to delete.
app.delete('/details/:id', (req, res) => {
    Detail.findByIdAndDelete(req.params.id, (err, detail) => {
        if (err) {
            return res.status(500).json({message: err});
        } else if (!detail) {
            return res.status(404).json({message: "Detail not found."});
        } else {
            res.status(200).json({message: "Detail deleted successfully."});
        }
    });
});

app.use((req, res) => res.sendFile('crud-app-homepage.html', {root: __dirname}));

// Listening.
app.listen(PORT, () => console.log(`The app is listening on port ${PORT}.`));