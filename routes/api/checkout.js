const express = require("express");
const CartServices = require("../../services/cart_services");
const CheckoutServices = require("./../../services/checkout_services")
const router = express.Router();
const Stripe = require("stripe")(process.env.STRIPE_KEY_SECRET);
const {
  checkIfAuthenticatedJWT
} = require("../../middlewares");

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
        amount: Math.ceil(item.related("books").get("cost") * 100),
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
      shipping_address_collection: {
        allowed_countries: ['SG'],
      },
      shipping_options: [{
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'sgd',
            },
            display_name: 'Free shipping',
            // Delivers between 5-7 business days
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            }
          }
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500,
              currency: 'sgd',
            },
            display_name: 'Next day air',
            // Delivers in exactly 1 business day
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 1,
              },
            }
          }
        },
      ],
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    };

    // create the payment session with the payment object and send to client
    let stripeSession = await Stripe.checkout.sessions.create(payment);

    // add checkout to orders table
    let checkout = new CheckoutServices(stripeSession);
    await checkout.processCheckout();
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

  // we need an endpointSecret to verify that this request is actually sent from stripe
  let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

  let sigHeader = req.headers['stripe-signature'];

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
  let session = event.data.object;
  let checkout = new CheckoutServices(session);
  switch (event.type) {
    case 'checkout.session.completed':
      checkout.updateCheckout();
      break;
    case 'checkout.session.expired':
      checkout.updateCheckout();
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);

  }

  res.send({
    'recieved': true
  })
})


module.exports = router;