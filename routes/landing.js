const express = require("express");
const router = express.Router(); 
const {createLoginForm,  bootstrapField} = require("../forms")
const {getHashedPassword} = require("../utils/hash")
const {
    User
} = require( '../models' );

router.get( "/", async ( req, res ) => {
    let loginForm = createLoginForm();
    res.render( "landing/index", {
        form: loginForm.toHTML( bootstrapField )
    } )
} )

router.post( "/", async ( req, res ) => {
    const loginForm = createLoginForm();
    loginForm.handle( req, {
        success: async ( form ) => {
            //process the form
            // find the user by email and password
            let currentUser = await User.where( {
                email: form.data.email,
            } ).fetch( {
                require: false,
                withRelated: [ "roles" ]
            } );

            // console.log( user.toJSON() )
            if ( !currentUser ) {
                // console.log( "User does not exist" )
                req.flash(
                    "error_messages",
                    "Sorry, the authentication details you have provided does not work"
                );
                res.redirect( "/login" )
            } else {
                // console.log( "User Exists" )
                if ( currentUser.get( "password" ) === getHashedPassword(form.data.password ) ) {
                    // console.log( req.session.user )
                    req.session.currentUser = {
                        id: currentUser.get( "id" ),
                        username: currentUser.get( "username" ),
                        email: currentUser.get( "email" ),
                        role: currentUser.related( "roles" ).toJSON()
                    };
                    console.log(req.session.currentUser)
                    req.flash(
                        "success_messages",
                        "Welcome back, " + currentUser.get( "username" )
                    );
                    // console.log( "LOGIN REQUEST = ", req.session );
                    // console.log( "THE USER IS: ", req.session.user )
                    res.redirect( `/books` );
                } else {
                    // console.log( "Password is not correct" )
                    req.flash(
                        "error_messages",
                        "Sorry, the authentication details you provided does not work"
                    );
                    res.redirect( "/" );
                }
            }
        },
        error: ( form ) => {
            req.flash(
                "error_messages",
                "There are some problems with logging you in. Please fill in the form again."
            );
            res.render( "landing/index", {
                form: form.toHTML( bootstrapField ),
            } );
        },
    } );
} );


module.exports = router; 