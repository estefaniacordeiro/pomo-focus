const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    lowercase: true, 
    unique: true, 
    required: [ true, "can't be blank" ], match: [/\S+@\S+\.\S+/, 'is invalid'], 
    index: true
  },
  hash: String,
  salt: String,
  settings: {
    focusTime: { type: Number, default: 25 },
    shortBreak: { type: Number, default: 5 },
    longBreak: { type: Number, default: 15 },
    totalSessions: { type: Number, default: 4}
  },
  stats: { type: Schema.Types.Mixed, default: {} },
  tasks: [ { name: String, lastUpdated: Number, stats: { type: Schema.Types.Mixed, default: {} } } ] 
});

UserSchema.plugin( uniqueValidator, { message: 'is already taken' });

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
}

UserSchema.methods.validPassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return hash === this.hash;
}

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    email: this.email,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
}

UserSchema.methods.toAuthJSON = function() {
  return {
    user: this.email,
    token: this.generateJWT()
  }
}


mongoose.model('User', UserSchema);