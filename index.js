
const stripe = require('stripe')('sk_test_51M0QGtCx996FZZgar0EDav42cUAomy2QXE4UIeae8WglFKFD7VtyfUx2Jkgkaw9hEMyJ9pPLZ2eqJbngBHZdkozK00YBZqs9VM');
const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const cors = require("cors")
// const bodyParser=require("body-parser")
const c_u = "mongodb+srv://blur:geAUpi2sSPs0Civh@cluster0.c7pvsmn.mongodb.net/?retryWrites=true&w=majority"
const app = express();
const uuid4 = require("uuid4");
const User = require('./data.js');
app.use(cors())
const bodyParser = require('body-parser');

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

  if (req.originalUrl === '/webhook') {
    next(); // Do nothing with the body because I need it in a raw state.
  } else {
    express.json()(req, res, next);  // ONLY do express.json() if the received request is NOT a WebHook from Stripe.
  }
});

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_NrHgb6PkXxZahXC5293FLnfnjhr37lNL";
// express.raw({type: 'application/json'}),
app.post('/webhook', async (request, response) => {

  const sig = request.headers['stripe-signature'];
  let event;

  const stripePayload = request.body;
  console.log({stripePayload});
  try {
    event = stripe.webhooks.constructEvent(stripePayload, sig, endpointSecret);
    console.log(("Tye block executeate successfully!"))
  } catch (err) {
    console.log("catch block executed")
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const invoiceUpcoming = event.data.object;
      console.log(invoiceUpcoming.customer_details.email)
      const itemCode = uuid4()
      try {
        // const item={
        //   email:invoiceUpcoming.customer_details.email,
        //   code:itemCode
        // }
        await new User({
          email: invoiceUpcoming.customer_details.email,
          code: itemCode
        }).save()

      } catch (error) {
        console.log(error)

      }

      const mailOptions = {
        from: 'sayem.mia@northsouth.edu',
        to: 'md1040582@gmail.com',
        subject: 'Blur Fucas Access Code.',
        text: `Your Access Code For Blur Focus is "${itemCode}"`
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      break;

  }
  response.status(200).end()
});

app.get('/webhook',(req,res)=>{
   res.send("hello worldd")
})
app.get('/',(req,res)=>{
   res.send("hello worldd")
})






app.get("/allCode", async (req, res) => {
  try {
    const item = await User.find({})
    res.status(201).send(item)
  } catch (error) {
    console.log(error)
  }
})
// app.use(express.json())

app.listen(4242, () => console.log('Running on port 4242'));