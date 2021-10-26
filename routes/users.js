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
    createLoginForm,
    createUpdateUserForm
} = require( '../forms' );

const {
    checkIfAuthenticated,
    checkRoles
} = require( "../middlewares" )

router.get( "/", checkIfAuthenticated, async ( req, res ) => {
    let users = await User.collection().fetch( {
        withRelated: [ "roles" ]
    } );
    res.render( "users/index", {
        users: users.toJSON(),
        active: {
            User: true
        }
    } )
} )

router.get( "/register", checkIfAuthenticated, checkRoles( [ 'Owner' ] ), async ( req, res ) => {
    let allRoles = await dataLayer.getAllRoles()
    const registerForm = registerUserForm( allRoles );
    res.render( "users/register", {
        form: registerForm.toHTML( bootstrapField ),
    } )
} )

router.post( '/register', checkIfAuthenticated, checkRoles( [ 'Owner' ] ), async ( req, res ) => {
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
                withRelated: [ "roles" ]
            } );

            // console.log( user.toJSON() )
            if ( !user ) {
                // console.log( "User does not exist" )
                req.flash(
                    "error_messages",
                    "Sorry, the authentication details you have provided does not work"
                );
                res.redirect( "/users/login" )
            } else {
                // console.log( "User Exists" )
                if ( user.get( "password" ) === getHashedPassword( form.data.password ) ) {
                    // console.log( req.session.user )
                    req.session.user = {
                        id: user.get( "id" ),
                        username: user.get( "username" ),
                        email: user.get( "email" ),
                        role: user.related( "roles" ).toJSON()
                    };
                    req.flash(
                        "success_messages",
                        "Welcome back, " + user.get( "username" )
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


router.get( "/:user_id/account", checkIfAuthenticated, async ( req, res ) => {
    let user = await dataLayer.getUserById( req.params.user_id );
    // console.log( user.toJSON() )
    res.render( "users/account", {
        user: user.toJSON()
    } )
} )

router.get( "/:user_id/account/update", checkIfAuthenticated, async ( req, res ) => {
    let user = await dataLayer.getUserById( req.params.user_id );
    let updateForm = createUpdateUserForm();
    updateForm.fields.username.value = user.get( "username" )
    updateForm.fields.email.value = user.get( "email" )
    res.render( "users/update", {
        user: user.toJSON(),
        form: updateForm.toHTML( bootstrapField )
    } )
} )

router.post( "/:user_id/account/update", checkIfAuthenticated, async ( req, res ) => {
    let user = await dataLayer.getUserById( req.params.user_id );
    let updateForm = createUpdateUserForm();
    updateForm.handle( req, {
        success: async ( form ) => {
            if ( getHashedPassword( form.data.old_password ) !== user.get( "password" ) ) {
                req.flash( "error_messages", "Your old password is incorrect. Please try again." )
                res.redirect( `/users/${req.params.user_id}/account/update` )
            } else {
                user.set( "username", form.data.username );
                user.set( "email", form.data.email );
                user.set( "password", getHashedPassword( form.data.new_password ) );
                await user.save()
                req.flash( "success_messages", `Your account details has been updated` )
                res.redirect( `/users/${user.id}/account` );
            }

        },
        error: async ( form ) => {
            req.flash(
                "error_messages",
                "There are some problems with updating your account details. Please fill in the form again."
            );
            res.render( "users/update", {
                user: user.toJSON(),
                form: updateForm.toHTML( bootstrapField )
            } )
        }
    } )

} )

router.get( "/:user_id/delete", checkIfAuthenticated, checkRoles( [ 'Owner' ] ), async ( req, res ) => {
    // fetch the user that we want to delete
    const user = await dataLayer.getUserById( req.params.user_id )

    res.render( "users/delete", {
        user: user.toJSON()
    } )
} )

router.post( "/:user_id/delete", checkIfAuthenticated, checkRoles( [ 'Owner' ] ), async ( req, res ) => {
    // fetch the user that we want to delete
    const user = await dataLayer.getUserById( req.params.user_id )
    await user.destroy();
    res.redirect( "/users" );
} )

router.get( "/logout", checkIfAuthenticated, async ( req, res ) => {
    req.session.user = null;
    req.flash( 'success_messages', "Goodbye" );
    res.redirect( "/users/login" );
} )

module.exports =
    router