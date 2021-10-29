const express = require( 'express' )
const router = express.Router()
const crypto = require( 'crypto' )
const jwt = require( 'jsonwebtoken' )
const {
    errorResponse
} = require( "./../../utils/errorResponse" )
const {
    Customer
} = require( "../../models" )
const customerDataLayer = require( '../../dal/customers' )

const {
    checkIfAuthenticatedJWT
} = require( '../../middlewares' )

const generateAccessToken = ( customer ) => {
    console.log( customer )
    return jwt.sign( {
        username: customer.get( "username" ),
        id: customer.get( "id" ),
        email: customer.get( "email" ),
        contact_number: customer.get( "contactNumber" ),
        address: customer.get( "address" )


    }, process.env.TOKEN_SECRET, {
        expiresIn: "1h"
    } );
}

const getHashedPassword = ( password ) => {
    const sha256 = crypto.createHash( 'sha256' );
    const hash = sha256.update( password ).digest( 'base64' );
    return hash;
}

router.post( "/register", async ( req, res ) => {
    let checkEmail = await Customer.where( {
        email: req.body.email
    } ).fetch( {
        require: false
    } );

    let checkUsername = await Customer.where( {
        username: req.body.username
    } ).fetch( {
        require: false
    } );

    if ( !checkEmail && !checkUsername ) {
        await customerDataLayer.createNewCustomer( req.body );
        res.send( {
            message: "Success"
        } )
    } else if ( checkEmail && checkUsername ) {
        return errorResponse(
            res,
            "The email and username provided already exists",
            401
        );
    } else if ( checkEmail )
        return errorResponse( res, "The email provided already exists", 406 );

    else if ( checkValidUsername !== null )
        return errorResponse( res, "The username provided already exists", 409 );
} )

router.post( '/login', async ( req, res ) => {
    let customer = await Customer.where( {
        'email': req.body.email
    } ).fetch( {
        require: false
    } );
    // console.log( customer )
    if ( customer && customer.get( 'password' ) == getHashedPassword( req.body.password ) ) {
        let accessToken = generateAccessToken( customer );
        res.send( {
            accessToken
        } )
    } else {
        return errorResponse( res, "Your login credentials are incorrect", 401 );
    }

} )

router.get( '/profile', checkIfAuthenticatedJWT, async ( req, res ) => {
    // console.log( req )
    const customer = req.customer;
    // console.log( customer )
    res.send( customer );
} )


module.exports = router;