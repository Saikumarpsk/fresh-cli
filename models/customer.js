const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  isGold: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  contacts:[
    { 
      laneNumber: { type: String, required: true },
      street: { type: String, required: true },
      district: { type: String, required: false },
      state: { type: String, required: true },
      groupImage: { type: String, required: false },
    }]
}));

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
    contacts : Joi.array().allow(null)
  };

  return Joi.validate(customer, schema);
}

exports.Customer = Customer; 
exports.validate = validateCustomer;