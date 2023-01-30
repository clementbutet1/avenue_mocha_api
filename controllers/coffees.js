require("dotenv").config();
const _ = require("lodash");
const CoffeesModel = require("../models/coffees");

const createCoffee = async (req, res) => {
  const coffee = new CoffeesModel({
    creator: req.body.creator,
    title: req.body.title,
    sugar: req.body.sugar,
    caffeine: req.body.caffeine,
    quantity: req.body.quantity,
  });
  coffee
    .save()
    .then(() => res.status(201).json({ message: "Coffee created" }))
    .catch(() => res.status(203).json({ error: "error hash" }));
};

const getAllCoffees = async (req, res) => {
  try {
    let coffees = await CoffeesModel.find();
    res.status(200).json(coffees);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const update = async (req, res) => {
  try {
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
