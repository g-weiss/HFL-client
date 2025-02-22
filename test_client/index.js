const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));

const port = 2999;
const host = "138.67.78.3";

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get('*', async (req, res) => {
    res.send("Page Not Found!");
});

app.listen(port, host, async () => {
    console.log(`Client Test Server running on port ${port}!`);
});