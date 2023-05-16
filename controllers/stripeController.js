const User = require('../data');
const { stripe } = require('../utils/stripe');
const nodemailer = require('nodemailer');
const uuid4 = require("uuid4");

const stripeController = {};
const blurrifycode = (
  CODE
) => `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
<div style="margin:50px auto;width:70%;padding:20px 0">
  <div style="border-bottom:1px solid #eee">
    <a href="https://blurrify.co/" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Blurrify.co</a>
  </div>
  <p style="font-size:1.1em">Hello,</p>
  <p>Thank you for choosing Blurrify.co . Use the following code to access our app. </p>
  <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${CODE}</h2>
  <p style="font-size:0.9em;">Regards,<br />Team Blurrify</p>
  <hr style="border:none;border-top:1px solid #eee" />
  <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
    <p>Blurrify.co</p>
    <p>1600 Amphitheatre Parkway</p>
    <p>California</p>
  </div>
</div>
</div>`;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sayem.mia@northsouth.edu',
    pass: 'sayambd5522'
  }
});
stripeController.webHook = async (request, response, next) => {
  try {
    const sig = request.headers['stripe-signature'];
    const endpointSecret = 'whsec_Tpf2swOMkqvBfnEf22oTC0Ss66xFBDKx';//for render server

    let event;

    try {
      
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const invoiceUpcoming = event.data.object;
        console.log(invoiceUpcoming.customer_details.email)
        const itemCode = uuid4()
        try {

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
          subject: 'Blurrify Access Code.',
          html: blurrifycode(itemCode)
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

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  } catch (e) {
    response.status(500).send({ message: e.message || 'something went wrong' });
  }
};

module.exports = stripeController;
