require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const expresseLayouts = require('express-ejs-layouts');
const reminder = require('./models/reminder');



