const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'Josh',
    password: 'TempPassword',
    database: 'project_2_website',
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to the database');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, and client-side JS)
app.use(express.static('public'));

// API endpoints
app.get('/api/items', (req, res) => {
    // Browse the list of items
    db.query('SELECT * FROM sunlabdatabase', (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

app.get('/api/items/sort', (req, res) => {
    const { sortBy } = req.query;
    let query;
    if (sortBy === 'name') {
        query = 'SELECT * FROM sunlabdatabase ORDER BY name';
    } else {
        query = 'SELECT * FROM sunlabdatabase ORDER BY id';
    }
    // Sort the list by item ID or name
    db.query(query, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

app.get('/api/items/search', (req, res) => {
    const { keyword } = req.query;
    const sql = 'SELECT * FROM sunlabdatabase WHERE name LIKE ? OR id = ?';
    const searchKeyword = `%${keyword}%`;
    // Search an item by a keyword or by ID
    db.query(sql, [searchKeyword, keyword], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

app.post('/api/items', (req, res) => {
    const { name, description, image } = req.body;
    const sql = 'INSERT INTO sunlabdatabase (name, description, image) VALUES (?, ?, ?)';
    db.query(sql, [name, description, image], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Item added successfully' });
    });
});

app.put('/api/items/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, image } = req.body;
    const sql = 'UPDATE sunlabdatabase SET name = ?, description = ?, image = ? WHERE id = ?';
    // Select an item to edit (assuming you can edit any attribute except for the ID)
    db.query(sql, [name, description, image, id], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Item updated successfully' });
    });
});

app.delete('/api/items/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM sunlabdatabase WHERE id = ?';
    // Remove an item
    db.query(sql, [id], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Item removed successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});