const express = require('express');
const bodyParser = require('body-parser');

const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

const app = express();

app.use((req, res, next) => { // We declare all the headers to allow :
    res.setHeader('Access-Control-Allow-Origin', '*'); // Connection from any origin
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Access to any of these routes
    next();
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

module.exports = app;