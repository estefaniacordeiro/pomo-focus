const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

const UserSchema = new mongoose.Schema({
  email: { type: String, lowercase: true, unique: true, required: [ true, "can't be blank" ], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
  hash: String,
  salt: String,

})