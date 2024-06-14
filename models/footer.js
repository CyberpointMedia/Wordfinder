const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
  footerCol1: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Widget'
  }],
  footerCol2: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Widget'
  }],
  footerCol3: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Widget'
  }],
  footerCol4: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Widget'
  }],
  footerCol5: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Widget'
  }],
}, { timestamps: true });

const Footer = mongoose.model('Footer', footerSchema);
module.exports =Footer; 