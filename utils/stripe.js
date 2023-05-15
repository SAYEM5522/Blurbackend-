const stripe = require('stripe')("sk_test_51M0QGtCx996FZZgar0EDav42cUAomy2QXE4UIeae8WglFKFD7VtyfUx2Jkgkaw9hEMyJ9pPLZ2eqJbngBHZdkozK00YBZqs9VM", {
  apiVersion: '2020-08-27',
});

// const { default: Stripe } = require('stripe');

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = { stripe };
