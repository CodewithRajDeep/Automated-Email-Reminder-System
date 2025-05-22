require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const expresseLayouts = require('express-ejs-layouts');
const reminder = require('./models/reminder');

const app = express();

app.use(express.urlencoded({extended:true}));

app.use(express.json());

//ejs-template engine
app.set('view engine', 'ejs');


app.set('views', path.join(__dirname, 'views'));
app.set(expresseLayouts);
app.set('layout', "layout");

mongoose.connect(process.env.MONGO_DB_URL).then(() => {
    console.log('connected to database');
}).catch((err) => {
    console.log(`Error: conncting to mongodb: ${err.message};`);
});
