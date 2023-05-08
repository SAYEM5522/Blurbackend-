
const stripe = require('stripe')('sk_test_51MxW3lBQWfASZckPHWvuHCrvuvLeNLEA07qXB03rO7LYVSoHjUxYeqa4WyuNN7mLKI8H6Ld4sEHMHWMIfvDZaLdW00KiXscUJC');
const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const cors=require("cors")
// const bodyParser=require("body-parser")
const c_u="mongodb+srv://blur:geAUpi2sSPs0Civh@cluster0.c7pvsmn.mongodb.net/?retryWrites=true&w=majority"
const app = express();
const uuid4=require("uuid4");
const User = require('./data.js');
app.use(cors())
// app.use(bodyParser.json())
const bodyParser = require('body-parser');

mongoose.connect(c_u,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
mongoose.connection.once('open',()=>{
  console.log("Connected Successfully")

})
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sayem.mia@northsouth.edu',
    pass: 'sayambd5522'
  }
});

// app.use(express.json()); // Parse request body as JSON for all requests

// app.use((req, res, next) => {
//   if (req.originalUrl === '/webhook') {
//     next();
//   } else {
//     next();
//   }
// });

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_6c778aa2ecddc40aac004d6c9bda3e93f68ecdf679fd2ebd2bb960c62ae58d20";
// express.raw({type: 'application/json'}),
app.post('/webhook',bodyParser.raw({type: 'application/json'}),  async(request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;
  
  
  // if(endpointSecret){
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  // }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const invoiceUpcoming = event.data.object;
      console.log(invoiceUpcoming.customer_details.email)
      const itemCode=uuid4()
      try {
        // const item={
        //   email:invoiceUpcoming.customer_details.email,
        //   code:itemCode
        // }
        await new User({
           email:invoiceUpcoming.customer_details.email,
          code:itemCode
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

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      break;

  }
 
  

  // Return a 200 response to acknowledge receipt of the event
  response.status(200).end()
});








app.get("/allCode",async(req,res)=>{
   try {
    const item=await User.find({})
    res.status(201).send(item)
   } catch (error) {
    console.log(error)
   }
})
// app.use(express.json())

app.listen(4242, () => console.log('Running on port 4242'));