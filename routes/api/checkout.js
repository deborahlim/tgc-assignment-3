const express = require("express");
const CartServices = require("../../services/cart_services");
const CheckoutServices = require("./../../services/checkout_services")
const router = express.Router();
const Stripe = require("stripe")(process.env.STRIPE_KEY_SECRET);
const {
  checkIfAuthenticatedJWT
} = require("../../middlewares");
const bookDataLayer = require("../../dal/books");
const orderDataLayer = require("../../dal/orders");
router.get("/", checkIfAuthenticatedJWT, async function (req, res) {

  // in stripe -- a payment object represents one transaction
  // a payment is defined by many line items
  let lineItems = [];
  let meta = [];
  let cart = new CartServices(parseInt(req.query.customer_id));

  let items = await cart.getCart();
  if (items.length !== 0) {
    // STEP 1 - create the line items
    for (let item of items) {
      // the keys of a line item are predefined and fixed by Stripe
      // and all of them must be present
      let lineItem = {
        name: item.related("books").get("title"),
        amount: item.related("books").get("cost") * 100,
        quantity: item.get("quantity"),
        currency: "SGD",
      };
      if (item.related("books").get("imageUrl")) {
        lineItem["images"] = [item.related("books").get("imageUrl")];
      }
      // add the line item to the array of line items
      lineItems.push(lineItem);

      // add in the id of the books and the quantity
      meta.push({
        book_id: item.get("book_id"),
        quantity: item.get("quantity"),
      });
    }

    // STEP 2 - create stripe payment object`

    // convert our meta data into a JSON string
    let metaData = JSON.stringify(meta);
    // the keys of the payment object are fixed by stripe
    // all of them are complusory (except metadata)
    const payment = {
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      metadata: {
        orders: metaData,
        customer_id: req.query.customer_id,
      },
    };


    // create the payment session with the payment object and send to client
    let stripeSession = await Stripe.checkout.sessions.create(payment);

    // if no completed checkout after 10 min, expire session
    setTimeout(async function () {
      const session = await Stripe.checkout.sessions.retrieve(
        stripeSession.id
      );
      // console.log("SESSION", session)
      if (session.payment_status === "unpaid") {
        // const expiredSession = await Stripe.checkout.sessions.expire(
        //   session.id
        // );
        const paymentIntent = await Stripe.paymentIntents.cancel(
          session.payment_intent
        );
        console.log("EXPIRED SESSION", paymentIntent)
        let checkout = new CheckoutServices(session.id);
        checkout.process_checkout(session, session.payment_status);
      }
    }, 600000);
    res.send({
      sessionId: stripeSession.id,
      publishableKey: process.env.STRIPE_KEY_PUBLISHABLE,
    });
  }
});


// webhook which Stripe will call to process the payment
router.post('/process_payment', express.raw({
  "type": "application/json"
}), async function (req, res) {
  // req contains data send to this endpoint from Stripe
  // and is only sent when Stripe completes a payment
  let payload = req.body;
  // console.log("PAYLOAD", payload)
  // we need an endpointSecret to verify that this request is actually sent from stripe
  let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
  // console.log("ENDPOINT SECRET= ", endpointSecret)
  let sigHeader = req.headers['stripe-signature'];
  // console.log("SIG HEADER= ", sigHeader);
  let event;
  try {
    event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);
    console.log("EVENT", event);
  } catch (e) {
    console.log(e.message);
    // the stripe request is invalid (i.e not from stripe)
    return res.status(400).send({
      'error': e.message
    })
  }
  // if the stripe request is verified to be from stripe
  // then we recreate payment session



  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log("STRIPE SESSION = ", session);
      // create new order
      let checkout = new CheckoutServices(session.id);
      checkout.process_checkout(session, session.payment_status);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);

  }

  res.send({
    'recieved': true
  })
})


module.exports = router;