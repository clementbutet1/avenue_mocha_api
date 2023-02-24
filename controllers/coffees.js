require("dotenv").config();
const _ = require("lodash");
const CoffeesModel = require("../models/coffees");
const { body, validationResult } = require('express-validator');
const escape = require('escape-html');

const createCoffee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  const coffee = new CoffeesModel({
    creator: escape(req.body.creator),
    title: escape(req.body.title),
    sugar: escape(req.body.sugar),
    caffeine: escape(req.body.caffeine),
    quantity: escape(req.body.quantity),
  });
  coffee
    .save()
    .then(() => res.status(201).json({ message: "Coffee created" }))
    .catch(() => res.status(203).json({ error: "error hash" }));
};

const getAllCoffees = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    let coffees = await CoffeesModel.find();
    res.status(200).json(coffees);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    let data = {
      ...req.body,
      updatedAt: Date.now(),
      lastModified: Date.now(),
    };
    await CoffeesModel.updateOne(
      { _id: req.params._id },
      { $set: data }
    ).exec();
    res.status(200).json(req.body);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getCoffeeById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const coffee = await CoffeesModel.find({ _id: req.params._id });
    res.status(200).json(coffee);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  createCoffee,
  getAllCoffees,
  update,
  getCoffeeById,
};
