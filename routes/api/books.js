const express = require( 'express' )
const router = express.Router();

const {
    Book
} = require( "../../models" )
const booksDataLayer = require( '../../dal/books' )


// Return all books
router.get( '/', async ( req, res ) => {
    res.send( await ( await booksDataLayer.getAllBooks() ).fetch( {
        withRelated: [ "authors" ]
    } ) )
} )

module.exports = router;