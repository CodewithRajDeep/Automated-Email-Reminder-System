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
app.use(express.static(path.join(__dirname, 'public')));

app.set(expresseLayouts);
app.set('layout', "layout");

mongoose.connect(process.env.MONGO_DB_URL).then(() => {
    console.log('connected to database...');
}).catch((err) => {
    console.log(`Error: conncting to mongodb: ${err.message};`);
});

app.get('/', (req,res) => {
    res.render('index', {
        title: 'Email Reminder App',
        currentPage: "home",
    });
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About - Email Reminder App',
    currentPage: 'about'
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));
