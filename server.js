const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (like your HTML, CSS, and JS)
app.use(express.static('public'));

// Path to the JSON file where we will store the visitor's data
const visitorsFile = path.join(__dirname, 'visitors.json');

// Handle form submission
app.post('/submit-contact', (req, res) => {
    const { name, email, message } = req.body;

    console.log(`Received submission: Name: ${name}, Email: ${email}, Message: ${message}`);

    // Read the existing data from visitors.json
    fs.readFile(visitorsFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading visitors file', err);
            return res.status(500).send('Error reading visitor data.');
        }

        let visitors = [];

        // If the file is not empty, parse the existing data
        if (data) {
            visitors = JSON.parse(data);
            console.log('Existing visitors data:', visitors);
        }

        // Add the new visitor's details
        visitors.push({ name, email, message });

        // Write the updated data back to visitors.json
        fs.writeFile(visitorsFile, JSON.stringify(visitors, null, 2), (err) => {
            if (err) {
                console.error('Error saving visitor data', err);
                return res.status(500).send('Error saving your details.');
            }

            console.log('New visitor data saved successfully!');
            // Respond to the user
            res.send('Thank you for contacting us! We will get back to you shortly.');
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
