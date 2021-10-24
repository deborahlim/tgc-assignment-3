const express = require( "express" );
const router = express.Router();
const dataLayer = require( "../dal/users" )
const crypto = require( 'crypto' );

const getHashedPassword = ( password ) => {
    const sha256 = crypto.createHash( 'sha256' );
    const hash = sha256.update( password ).digest( 'base64' );
    return hash;
}

// import in the User model
const {
    User
} = require( '../models' );

const {
    registerUserForm,
    bootstrapField,
    createLoginForm
} = require( '../forms' );

router.get( "/register", async ( req, res ) => {
    let allRoles = await dataLayer.getAllRoles()
    const registerForm = registerUserForm( allRoles );
    res.render( "users/register", {
        form: registerForm.toHTML( bootstrapField ),
        active: {
            Register: true
        }
    } )
} )

router.post( '/register', async ( req, res ) => {
    let allRoles = await dataLayer.getAllRoles()
    const registerForm = registerUserForm( allRoles );
    registerForm.handle( req, {
        success: async ( form ) => {
            const user = new User( {
                'username': form.data.username,
                'password': getHashedPassword( form.data.password ),
                'email': form.data.email,
                'role_id': form.data.role_id
            } );
            await user.save();
            req.flash( "success_messages", "User has been registered successfully" )
            res.redirect( '/books' )
        },
    } )
} )

router.get( "/login", async ( req, res ) => {
    let loginForm = createLoginForm();
    res.render( "users/login", {
        form: loginForm.toHTML( bootstrapField )
    } )
} )

router.post( "/login", async ( req, res ) => {
    const loginForm = createLoginForm();
    loginForm.handle( req, {
        success: async ( form ) => {
            //process the form
            // find the user by email and password
            let user = await User.where( {
                email: form.data.email,
            } ).fetch( {
                require: false,
            } );
            if ( !user ) {
                req.flash(
                    "error_messages",
                    "Sorry, the authentication details you have provided does not work"
                );
            } else {
                if ( user.get( "password" ) === getHashedPassword( form.data.password ) ) {
                    req.session.user = {
                        id: user.get( "id" ),
                        username: user.get( "username" ),
                        email: user.get( "email" ),
                    };
                    req.flash(
                        "success_messages",
                        "Welcome back, " + user.get( "username" )
                    );
                    console.log( "LOGIN REQUEST = ", req.session );
                    res.redirect( "/users/profile" );
                } else {
                    req.flash(
                        "error_messages",
                        "Sorry, the authentication details you provided does not work"
                    );
                    res.redirect( "/users/login" );
                }
            }
        },
        error: ( form ) => {
            req.flash(
                "error_messages",
                "There are some problems with logging you in. Please fill in the form again."
            );
            res.render( "users/login", {
                form: form.toHTML( bootstrapField ),
            } );
        },
    } );
} );

router.get( "/profile", async ( req, res ) => {
    let user = req.session.user;
    res.render( "users/profile", {
        user: user
    } )
} )

router.get( "/logout", async ( req, res ) => {
    req.session.user = null;
    req.flash( 'success_messages', "Goodbye" );
    res.redirect( "/users/login" );
} )

module.exports =
    router