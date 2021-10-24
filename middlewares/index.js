const {
    Model
} = require( "bookshelf" );

const checkIfAuthenticated = ( req, res, next ) => {
    if ( req.session.user ) {
        next()
    } else {
        req.flash( "error_messages", "You need to log in to access this page" )
        res.redirect( "/users/login" )
    }
}

module.exports = {
    checkIfAuthenticated
}