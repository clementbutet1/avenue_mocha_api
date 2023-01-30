const mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateFrance = moment.tz(Date.now(), 'Europe/Paris');

const Coffees = mongoose.Schema(
    {
        creator: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: '',
        },
        sugar: {
            type: Number,
            default: 0,
        },
        caffeine: {
            type: Number,
            default: 0,
        },
        quantity: {
            type: Number,
            default: 0,
        },
        status: {
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
    },
    {
        collection: 'coffees',
    },
);

Coffees.index({ '$**': 'text' });
Coffees.index({ subscribed_on: 1 }, { expireAfterSeconds: 604800 });
Coffees.plugin(require('mongoose-autopopulate'));

const CoffeesModel = mongoose.model('coffees', Coffees);

module.exports = CoffeesModel;