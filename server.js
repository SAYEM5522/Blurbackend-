// ALL REQUIRES STARTS
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const stripeRoute = require('./routes/stripeRoute');
const uuid4 = require("uuid4");
const nodemailer = require('nodemailer');
const c_u = "mongodb+srv://blur:geAUpi2sSPs0Civh@cluster0.c7pvsmn.mongodb.net/?retryWrites=true&w=majority"
const Appsumo=require("./Appsumocode")
// CREATING APP
const app = express();
app.use(
  cors({
    origin: '*',
  })
);
mongoose.connect(c_u, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
mongoose.connection.once('open', () => {
  console.log("Connected Successfully")

})
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sayem.mia@northsouth.edu',
    pass: 'sayambd5522'
  }
});
app.use((req, res, next) => {
  if (req.originalUrl === '/api/v1/stripe/webHook') {
    console.log(req.originalUrl)
    next();
  } else {
    express.json({ limit: '10mb' })(req, res, next);
  }
});

app.post('/appsumo', (req, res) => {
  const items = req.body;
  console.log(items) // Assuming the array of items is provided in the request body

  // Insert the array of items into the database
  Appsumo.insertMany(items)
    .then(() => {
      res.status(200).json({ message: 'Items inserted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to insert items' });
    });
});

app.put('/appsumo/:code', (req, res) => {
  const code = req.params.code; // Get the code from the route parameters

  // Find the Appsumo document with the matching code
  Appsumo.findOne({ code })
    .then((appsumo) => {
      if (!appsumo) {
        // Code not found in the database
        return res.status(404).json({ error: 'Code not found' });
      }

      if (appsumo.turn === 0) {
        // Turn number is already 0
        return res.status(200).json({ message: 'Trial number has finished' });
      }
      appsumo.turn -= 1;
      return appsumo.save();
    })
    .then(() => {
      res.status(200).json({ message: 'Trial number updated successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to update turn number' });
    });
});



const PORT = process.env.PORT || 4242;


app.use('/api/v1/stripe', stripeRoute);

// ROOT API
app.get('/', async (req, res) => {
  try {
    res.send({
      runningOn: process.env.NODE_ENV, 
      isSuccess: true,
      date: '3/9/2023', //last deploy date
    });
  } catch (e) {
    res.send({ e: e });
  }
});
  app.listen(process.env.PORT || 4242, () => {
    console.log('server started');
  });
