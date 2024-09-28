const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const filePath = 'output.txt';

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle fetching all messages
app.get('/messages', (req, res) => {
    // Read the messages from the file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            res.status(500).send('Server error');
            return;
        }
        // Split the file data into an array of messages
        const messages = data.split('\n').filter(Boolean); // Filter out empty lines
        res.json(messages); // Send the messages as JSON
    });
});

// Handle form submission
app.post('/submit', (req, res) => {
    const userText = req.body.userText;

    // Append the text to a file
    fs.appendFile(filePath, userText + '\n', (err) => {
        if (err) {
            console.error('Error writing to file', err);
            res.status(500).send('Server error');
        } else {
            // Send success message back as plain text
            res.send('Data submitted successfully!');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
