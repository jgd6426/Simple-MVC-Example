// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

const { Cat } = models;

// default fake data so that we have something to work with until we make a real Cat
const defaultData = {
  name: 'unknown',
  bedsOwned: 0,
};

let lastAdded = new Cat(defaultData);
console.log(lastAdded);

const hostIndex = (req, res) => {
  res.render('index', {
    currentName: lastAdded.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

const hostPage1 = async (req, res) => {
  try {
    const docs = await Cat.find({}).lean().exec();
    return res.render('page1', { cats: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Failed to retrieve cats' });
  }
};

const hostPage2 = (req, res) => {
  res.render('page2');
};

const hostPage3 = (req, res) => {
  res.render('page3');
};

const getName = (req, res) => res.json({ name: lastAdded.name });

const setName = async (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({ error: 'firstname,lastname, and beds are all required' });
  }

  const catData = {
    name: `${req.body.firstname} ${req.body.lastname}`,
    bedsOwned: req.body.beds,
  };

  const newCat = new Cat(catData);

  try {
    await newCat.save();

    lastAdded = newCat;
    return res.json({
      name: lastAdded.name,
      beds: lastAdded.bedsOwned,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Failed to create cat' });
  }
};

const searchName = async (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  try {
    const doc = await Cat.findOneAndUpdate({ name: req.query.name }, { $inc: { bedsOwned: 1 } });

    // const doc = await Cat.findOne({name: req.query.name}).select('name bedsOwned').exec();

    if (!doc) {
      return res.status(404).json({ error: 'No cat found' });
    }

    return res.json({ name: doc.name, beds: doc.bedsOwned });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong finding cat' });
  }
};

const updateLast = (req, res) => {
  lastAdded.bedsOwned++;

  lastAdded.save().then(() => res.json({
    name: lastAdded.name,
    beds: lastAdded.bedsOwned,
  })).catch((err) => {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong updating cat' });
  });
};

const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  getName,
  setName,
  updateLast,
  searchName,
  notFound,
};
