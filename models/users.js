const mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateFrance = moment.tz(Date.now(), 'Europe/Paris');

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      minlength: 1,
      maxlength: 50,
    },
    email: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    password: {
      type: String,
    },
    profilepic: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: dateFrance,
    },
    updatedAt: {
      type: Date,
    },
    token: {
      type: String,
    },
    deviceId: String,
  },
  {
    collection: 'users',
  },
);

UserSchema.index({'$**': 'text'});
UserSchema.index({ subscribed_on: 1 }, { expireAfterSeconds: 604800 });
UserSchema.plugin(require('mongoose-autopopulate'));

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;