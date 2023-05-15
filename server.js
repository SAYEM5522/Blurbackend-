// ALL REQUIRES STARTS
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const stripeRoute = require('./routes/stripeRoute');

// CREATING APP
const app = express();
app.use(
  cors({
    origin: '*',
  })
);

app.use((req, res, next) => {
  if (req.originalUrl === '/api/v1/stripe/webHook') {
    next();
  } else {
    express.json({ limit: '10mb' })(req, res, next);
  }
});
// app.use('/api/v1/stripe/webHook', bodyParser.raw({ type: '*/*' }));
// app.use(bodyParser.json());

// app.use(
//   '/api/v1/stripe/webHook',
//   bodyParser.json({
//     verify: function (req, res, buf) {
//       var url = req.originalUrl;
//       if (url.startsWith('/stripe')) {
//         req.rawBody = buf.toString();
//       }
//     },
//   })
// );

// DECLARING PORT
const PORT = process.env.PORT || 4242;

// MONGODB URI
// const mongoDbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ndb6b.mongodb.net/email_assistant`;
let mongoDbURI;
if (process.env.NODE_ENV === 'development') {
  // mongoDbURI = `mongodb+srv://admin:${process.env.DB_PASS}@cluster0.7nromku.mongodb.net/replie_test_db`;
  mongoDbURI = `mongodb+srv://admin:${process.env.DB_PASS}@cluster0.7nromku.mongodb.net/replie_live_db`;
} else {
  mongoDbURI = `mongodb+srv://admin:${process.env.DB_PASS}@cluster0.7nromku.mongodb.net/replie_live_db`;
}

// MIDDLEWARES
const middlewares = [express.urlencoded({ extended: true })];

if (process.env.NODE_ENV === 'development') {
  app.use(require('morgan')('dev'));
}
app.use(middlewares);

// ROUTE DECLARATION
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

// CONNECT DB WITH MONGOOSE
mongoose
  .connect(mongoDbURI, { useNewUrlParser: true })
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      app.listen(PORT, () => {
        console.log(`SERVER IS RUNNING ON PORT: ${PORT} ❤️`);
        console.log('DB CONNECTED');
      });
    } else {
      app.listen(process.env.PORT || 4242, () => {
        console.log('server started');
      });
    }
  })
  .catch((err) => {
    console.log(`SERVER ERROR: ${err}`);
  });
