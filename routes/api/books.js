const express = require( 'express' )
const router = express.Router();

const {
    Book
} = require( "../../models" )
const booksDataLayer = require( '../../dal/books' )


// Return all books
router.get( '/', async ( req, res ) => {
    let books = await booksDataLayer.getAllBooks()
    res.send( books );
} )
module.exports = router;