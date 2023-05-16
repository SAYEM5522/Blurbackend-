// All Requires
const router = require('express').Router();
const express = require('express');
const stripeController = require('../controllers/stripeController');
const { webHook } = stripeController;


// Routes
/**
 * @method POST
 * @endpoint base_url/api/v1/stripe/webHook
 */
router.post('/webHook/', express.raw({ type: 'application/json' }), webHook);
router.get("/",(req,res)=>{
   res.send("hello")
})

// Export
module.exports = router;
