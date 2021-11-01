const {
    Model
} = require( "bookshelf" );
const jwt = require( 'jsonwebtoken' );
const checkIfAuthenticated = ( req, res, next ) => {
    if ( req.session.user ) {
        next()
    } else {
        req.flash( "error_messages", "You need to log in to access this page" )
        res.redirect( "/users/login" )
    }
}

const checkIfAuthenticatedJWT = ( req, res, next ) => {
    const authHeader = req.headers.authorization;

    if ( authHeader ) {
        const token = authHeader.split( ' ' )[ 1 ];
        console.log( token )
        jwt.verify( token, process.env.TOKEN_SECRET, ( err, customer ) => {
            console.log( customer )
            console.log( token )
            if ( err ) {
                console.log( err );
                return res.sendStatus( 403 );
            }

            req.customer = customer;
            next();
        } );
    } else {
        res.sendStatus( 401 );
    }
};

const checkRoles = ( userRoles ) => {
    return ( req, res, next ) => {
        // console.log( "USER DETAILS", req.session.user )
        if ( userRoles.includes( req.session.user.role.name ) ) {
            next()
        } else {
            req.flash( "error_messages", "You do not have permission to access this page " )
            res.redirect( "back" )
        }
    }
}


module.exports = {
    checkIfAuthenticated,
    checkRoles,
    checkIfAuthenticatedJWT
}