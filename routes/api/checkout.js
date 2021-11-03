const express = require( 'express' );
const CartServices = require( '../../services/cart_services' );
const router = express.Router();
const Stripe = require( 'stripe' )( process.env.STRIPE_KEY_SECRET )
const bodyParser = require( 'body-parser' );
const {
    checkIfAuthenticatedJWT
} = require( '../../middlewares' )
router.get( '/', checkIfAuthenticatedJWT, async function ( req, res ) {
    // in stripe -- a payment object represents one transaction
    // a payment is defined by many line items
    let lineItems = [];
    let meta = [];
    console.log( req.query.customer_id )
    let cart = new CartServices( parseInt( req.query.customer_id ) );
    console.log( "CART=====", cart )
    let items = await cart.getCart();

    console.log( "ITEMS======", items )
    // STEP 1 - create the line items
    for ( let item of items ) {
        // the keys of a line item are predefined and fixed by Stripe
        // and all of them must be present        
        let lineItem = {
            'name': item.related( 'books' ).get( 'title' ),
            'amount': item.related( 'books' ).get( 'cost' ),
            'quantity': item.get( 'quantity' ),
            'currency': 'SGD'
        }
        if ( item.related( 'books' ).get( 'imageUrl' ) ) {
            lineItem[ 'images' ] = [ item.related( 'books' ).get( 'imageUrl' ) ]
        }
        // add the line item to the array of line items
        lineItems.push( lineItem );

        // add in the id of the books and the quantity
        meta.push( {
            'book_id': item.get( 'book_id' ),
            'quantity': item.get( 'quantity' )
        } )
    }

    // STEP 2 - create stripe payment object`

    // convert our meta data into a JSON string
    let metaData = JSON.stringify( meta );
    // the keys of the payment object are fixed by stripe
    // all of them are complusory (except metadata)
    console.log( "METADATA==============", metaData )
    const payment = {
        'payment_method_types': [ 'card' ],
        'line_items': lineItems,
        'success_url': process.env.STRIPE_SUCCESS_URL,
        'cancel_url': process.env.STRIPE_CANCEL_URL,
        'metadata': {
            'orders': metaData,
            'customer_id': req.query.customer_id
        }
    }
    console.log( "PAYMENT", payment )

    // create the payment session with the payment object
    let stripeSession = await Stripe.checkout.sessions.create( payment );
    console.log( "SESSION_ID============", stripeSession )
    res.send( {
        'sessionId': stripeSession.id,
        'publishableKey': process.env.STRIPE_KEY_PUBLISHABLE
    } )
} )

module.exports = router