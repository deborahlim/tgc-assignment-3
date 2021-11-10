const jwt = require( 'jsonwebtoken' );
const checkIfAuthenticated = ( req, res, next ) => {
    if ( req.session.currentUser ) {
        next()
    } else {
        req.flash( "error_messages", "You need to log in to access this page" )
        res.redirect( "/" )
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
        if ( userRoles.includes( req.session.currentUser.role.name ) ) {
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