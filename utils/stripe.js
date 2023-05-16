const stripe = require('stripe')("sk_test_51N5ooYBEOxUQKVOWUfcRHqTv3YiaWwrBnJ4gIUZ0RN438y1Z4D5OysnT1hE0JYdFoa3qNBlFJaw9NwrTYCZ0Ob970041MVGKKt", {
  apiVersion: '2020-08-27',
});

// const { default: Stripe } = require('stripe');

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = { stripe };
