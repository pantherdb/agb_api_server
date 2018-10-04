#!/usr/bin/env nodejs
// We’ll declare all our dependencies here
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/database');
const genelist = require('./controllers/genelist');
//const cache = require('memory-cache');

//Connect mongoose to our database
mongoose.connect(config.database);

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback) {
    console.log("Connection succeeded.");
});

//Declaring Port
const port = 3001;

//Initialize our app variable
const app = express();

//Middleware for CORS
app.use(cors());

//Middlewares for bodyparsing using both json and urlencoding
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



/*express.static is a built in middleware function to serve static files.
 We are telling express server public folder is the place to look for the static files

*/
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req,res) => {
    res.send("Invalid page");
})


//Routing all HTTP requests to /genelist to genelist controller
app.use('/genelist', genelist);



//Listen to port 3000
app.listen(port, () => {
    console.log(`Starting the server at port ${port}`);
});