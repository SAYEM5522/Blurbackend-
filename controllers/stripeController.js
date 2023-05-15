const { stripe } = require('../utils/stripe');

const stripeController = {};



stripeController.webHook = async (request, response, next) => {
  try {
    const sig = request.headers['stripe-signature'];
    const endpointSecret = 'whsec_y7Pbv7FcjPL3V1gLhixTSyk3oNFGYyYH';//for render server

    let event;

    try {
      console.log({
        stripeWebhooksConstructEvent: stripe.webhooks.constructEvent,
      });
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // switch (event.type) {
    //   case 'charge.succeeded':
    //     const chargeSucceeded = event.data.object;
    //     const status = chargeSucceeded?.status;
    //     const paid = chargeSucceeded?.paid;
    //     const amount_captured = chargeSucceeded?.amount_captured;
    //     const email = chargeSucceeded?.billing_details?.email;
    //     console.log({
    //       email,
    //       status,
    //       paid,
    //       amount_captured,
    //     });
    //     if (email && paid && amount_captured && status === 'succeeded') {
    //       //update your database
    //       if (amount_captured === 997) {
    //         //add basic subscription
    //         try {
    //           const query = { email: email };
    //           const options = { upsert: true };
    //           const endDate = new Date();
    //           endDate.setMonth(endDate.getMonth() + 1);

    //           const updateDoc = {
    //             $set: {
    //               selectedPackage: 'pro',
    //               endDate: endDate,
    //             },
    //           };
    //           const userUpdate = await User.updateOne(
    //             query,
    //             updateDoc,
    //             options
    //           );
    //           console.log({ userUpdate });
    //         } catch (e) {
    //           console.log(e);
    //         }
    //         // const end_date = new Date(trial).toISOString().split('T')[0];
    //       } else if (amount_captured === 9700) {
    //         //add pro subscription
    //         try {
    //           const query = { email: email };
    //           const options = { upsert: true };
    //           const endDate = new Date();
    //           endDate.setFullYear(endDate.getFullYear() + 1);
    //           const updateDoc = {
    //             $set: {
    //               selectedPackage: 'pro',
    //               endDate: endDate,
    //             },
    //           };
    //           const userUpdate = await User.updateOne(
    //             query,
    //             updateDoc,
    //             options
    //           );
    //           console.log({ userUpdate });
    //         } catch (e) {
    //           console.log(e);
    //         }
    //       } else {
    //         console.log('request to another server');
    //       }
    //     } else {
    //       response.status(422).send({
    //         isSuccess: false,
    //         message:
    //           'billing details or some important payment infos are missing!',
    //       });
    //     }
    //     break;
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  } catch (e) {
    response.status(500).send({ message: e.message || 'something went wrong' });
  }
};

module.exports = stripeController;
