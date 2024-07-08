require('dotenv').config();

const path = require('node:path');
const express = require('express');
const router = require('./app/routers');

const port = process.env.PORT || `4000`;

const app = express();

app.set('view engine', 'template engine');
app.set('views', './app/views');

app.use(express.static(path.join(__dirname, './public')));

app.use(router);

app.listen(port, () => {
    console.log(`Server ready: http://localhost:${port}`);
});