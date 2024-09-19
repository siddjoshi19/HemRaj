const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path'); // Correctly handle file paths
const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Path to the visitors.json file
const visitorsFile = path.join(__dirname, 'visitors.json');

// Handle form submission
app.post('/submit-contact', (req, res) => {
    const { name, email, message } = req.body;

    // Log received form data for debugging
    console.log(`Received: Name: ${name}, Email: ${email}, Message: ${message}`);

    // Read the current contents of visitors.json
    fs.readFile(visitorsFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading visitors.json file:', err);
            return res.status(500).send('Internal Server Error');
        }

        let visitors = [];

        // If the file contains data, parse it
        if (data) {
            try {
                visitors = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing visitors.json:', parseErr);
                return res.status(500).send('Error processing visitor data');
            }
        }

        // Add the new visitor data
        visitors.push({ name, email, message });

        // Write the updated visitors data back to visitors.json
        fs.writeFile(visitorsFile, JSON.stringify(visitors, null, 2), (err) => {
            if (err) {
                console.error('Error writing to visitors.json:', err);
                return res.status(500).send('Error saving visitor data');
            }

            // Successfully saved
            console.log('Visitor data saved successfully!');
            res.send('Thank you for submitting your details!');
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
