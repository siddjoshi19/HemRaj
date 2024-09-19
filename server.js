const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve the HTML file for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the HTML file for other products
app.get('/other-products', (req, res) => {
    res.sendFile(path.join(__dirname, 'other-products.html'));
});

// Handle contact form submissions
app.post('/contact', (req, res) => {
    console.log(req.body); // Log the incoming form data

    const { name, email, message } = req.body;
    const contactData = { name, email, message };

    // Save to a JSON file
    fs.readFile('contactData.json', (err, data) => {
        let contacts = [];
        if (!err) {
            contacts = JSON.parse(data);
        }
        contacts.push(contactData);
        fs.writeFile('contactData.json', JSON.stringify(contacts, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error saving data.');
            }
            console.log('Contact data saved!');
            res.redirect('/'); // Redirect back to the homepage after submission
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
