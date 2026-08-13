const express = require('express');
const cors = require('cors');

const {logs} = require('./database.js');

const app = express();
app.use(express.json());

app.get('/api/logs/:id', (req, res) => {
    const id = req.params.id;
    const userLog = logs.prepare(`
        SELECT * FROM logs WHERE userId = ?
    `).all(id);
    res.json(userLog);
});

const PORT = process.env.PORT || 25742;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`API listening on port ${PORT}`);
});