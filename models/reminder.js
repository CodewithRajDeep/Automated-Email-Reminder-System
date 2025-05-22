const mongoose = require('mongoose');
const {render} = require('ejs');

const reminderSchema = new mongoose.Schema({
  email: {
    type:String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  scheduleTime: {
    type: Date,
    required: true,
  },
  sent : {
    type: Boolean,
    default: false
  },
});

module.exports = mongoose.model('Reminder', reminderSchema);