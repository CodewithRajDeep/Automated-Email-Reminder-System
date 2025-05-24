require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const expressLayouts = require('express-ejs-layouts');
const Reminder = require("./models/reminder");
const app = express();

app.use(express.urlencoded({extended:true}));

app.use(express.json());

//ejs-template engine
app.set('view engine', 'ejs');


app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


app.use(expressLayouts);
app.set('layout', 'layout');

mongoose.connect(process.env.MONGO_DB_URL).then(() => {
    console.log('connected to database...');
}).catch((err) => {
    console.log(`Error: conncting to mongodb: ${err.message};`);
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth:{
    user:process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  }
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

app.get('/schedule', (req, res) => {
  res.render('schedule', {
    title: 'Schedule Reminder',
    currentPage: 'about'
  });
});

app.post('/schedule', async (req, res) => {
  try {
    const { email, message, datetime } = req.body;

    console.log('Received:', { email, message, datetime });

    if (!datetime || isNaN(new Date(datetime).getTime())) {
      throw new Error('Invalid or missing dateTime');
    }

    const reminder = new Reminder({
      email,
      message,
      scheduleTime: new Date(datetime),
    });

    await reminder.save();
    res.redirect('/schedule?success=true');
  } catch (error) {
    console.error('Error saving reminder:', error.message || error);
    res.redirect('/schedule?error=true');
  }
});

app.get('/reminders', async(req, res) => {
  try {
    const reminders = await Reminder.find().sort({scheduleTime:1});
    res.render('reminders', {
      reminders,
      title: "My Reminders",
      currentPage: "reminders",
    });
  } catch (error) {
    console.error('Error saving reminder:', error.message || error);
    res.redirect("/?error=true");
  }
});

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const reminders = await Reminder.find({
      scheduleTime: { $lte: now },
      sent: false,
    });

    for (const reminder of reminders) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: reminder.email,
        subject: "Reminder",
        text: reminder.message,
      });

      reminder.sent = true;
      await reminder.save();
    }
  } catch (error) {
    console.error("Error sending reminders:", error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));
