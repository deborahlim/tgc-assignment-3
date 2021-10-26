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
    checkRoles
}