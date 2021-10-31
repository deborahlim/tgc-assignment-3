const express = require( "express" );
const hbs = require( "hbs" );
const wax = require( "wax-on" );
require( "dotenv" ).config();
const session = require( 'express-session' );
const flash = require( 'connect-flash' );
const FileStore = require( 'session-file-store' )( session );
const csrf = require( 'csurf' )
const cors = require( 'cors' );
// create an instance of express app
let app = express();

// static folder
app.use( express.static( 'public' ) );
// set the view engine
app.set( "view engine", "hbs" );



// setup wax-on
wax.on( hbs.handlebars );
wax.setLayoutPath( "./views/layouts" );


// enable forms
app.use(
    express.urlencoded( {
        extended: false
    } )
);
// Cors must be enabled before session
app.use( cors() )

// set up sessions
app.use( session( {
    store: new FileStore(),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
} ) );

app.use( flash() )
// Register Flash middleware
app.use( function ( req, res, next ) {
    res.locals.success_messages = req.flash( "success_messages" );
    res.locals.error_messages = req.flash( "error_messages" );
    next();
} );

// Share the user data with hbs files
app.use( function ( req, res, next ) {
    res.locals.user = req.session.user;
    next();
} )
// enable protection from cross site request forgery
// app.use( csrf() );
const csrfInstance = csrf();
app.use( function ( req, res, next ) {
    // exclude /checkout/process_payment for CSRF
    if ( req.url.slice( 0, 5 ) == "/api/" ) {
        return next()
    }
    csrfInstance( req, res, next )
} )

// handle CSRF error
app.use( function ( err, req, res, next ) {
    if ( err && err.code == "EBADCSRFTOKEN" ) {
        req.flash( 'error_messages', 'The form has expired. Please try again' );
        res.redirect( 'back' );
    } else {
        next()
    }
} );

// Share CSRF with hbs files
app.use( function ( req, res, next ) {
    if ( req.csrfToken ) {
        res.locals.csrfToken = req.csrfToken();
    }
    next();
} )
// import in routes
const landingRoutes = require( './routes/landing' );
const booksRoutes = require( "./routes/books" );
const cloudinaryRoutes = require( "./routes/cloudinary" );
const userRoutes = require( "./routes/users" );
const authorRoutes = require( "./routes/authors" );
const publisherRoutes = require( "./routes/publishers" );
const genreRoutes = require( "./routes/genres" );
const tagRoutes = require( "./routes/tags" );
const api = {
    books: require( "./routes/api/books" ),
    customers: require( "./routes/api/customers" ),
    cart: require( "./routes/api/cart" )
}

async function main() {
    app.use( "/", landingRoutes );
    app.use( "/books", booksRoutes );
    app.use( "/cloudinary", cloudinaryRoutes );
    app.use( "/users", userRoutes );
    app.use( "/authors", authorRoutes );
    app.use( "/publishers", publisherRoutes );
    app.use( "/genres", genreRoutes );
    app.use( "/tags", tagRoutes );
    app.use( "/api/books", express.json(), api.books )
    app.use( "/api/customers", express.json(), api.customers )
    app.use( "/api/cart", express.json(), api.cart )

}
main();

app.listen( 3000, () => {
    console.log( "Server has started" );
} );