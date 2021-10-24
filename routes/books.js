const express = require( "express" );
const {
    createBookForm,
    bootstrapField,
} = require( "../forms" );
const router = express.Router();

// #1 import in the Product model
const {
    Book,
    Format,
    Genre,
    Publisher,
    Tag,
    Author
} = require( "../models" )
const {
    checkIfAuthenticated
} = require( "./../middlewares" );
const dataLayer = require( "../dal/books" )

router.get( "/", checkIfAuthenticated, async ( req, res ) => {
    // #2 - fetch all the Books (ie, SELECT * from Books)
    let books = await Book.collection().fetch( {
        withRelated: [ "genres", "formats", "publishers", "tags", "authors" ]
    } );
    console.log( books.toJSON() )
    let formattedDateBooks = books.toJSON()
    formattedDateBooks.forEach( ( book ) => {
        book.publishedDate = book.publishedDate.toISOString().slice( 0, 10 );
    } )
    res.render( 'books/index', {
        books: formattedDateBooks // #3 - convert collection to JSON
    } )
} )

router.get( "/create", checkIfAuthenticated, async ( req, res ) => {

    const allFormats = await dataLayer.getAllRelated( Format )
    const allGenres = await dataLayer.getAllRelated( Genre )
    const allPublishers = await dataLayer.getAllRelated( Publisher )
    const allTags = await dataLayer.getAllRelated( Tag )
    const allAuthors = await dataLayer.getAllRelated( Author )

    // create an instance of the form
    const bookForm = createBookForm( allFormats, allGenres, allPublishers, allTags, allAuthors );
    res.render( "books/create", {
        // convert the form to its HTML equivalent
        form: bookForm.toHTML( bootstrapField ),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET

    } )
} )

router.post( "/create", checkIfAuthenticated, async ( req, res ) => {
    const allFormats = await dataLayer.getAllRelated( Format )
    const allGenres = await dataLayer.getAllRelated( Genre )
    const allPublishers = await dataLayer.getAllRelated( Publisher )
    const allTags = await dataLayer.getAllRelated( Tag )
    const allAuthors = await dataLayer.getAllRelated( Author )

    const bookForm = createBookForm( allFormats, allGenres, allPublishers, allTags, allAuthors );

    bookForm.handle( req, {
        success: async ( form ) => {
            let {
                tags,
                authors,
                ...bookData
            } = form.data;
            // console.log(tags)
            const book = new Book( bookData );
            // console.log(book);
            await book.save();
            if ( tags ) {
                // attach id of selected tags to the book
                // caolan forms will return tags as "1, 2, 3"
                await book.tags().attach( tags.split( "," ) )
            }
            if ( authors ) {
                await book.authors().attach( authors.split( "," ) )
            }
            console.log( book.toJSON() );
            req.flash( "success_messages", `New Book ${book.title} has been added` )
            res.redirect( "/books" );
        },
        error: async ( form ) => {
            console.log( "Error" )
            res.render( "books/create", {
                "form": form.toHTML( bootstrapField )
            } )
        }


    } )
} )

router.get( "/:book_id/update", checkIfAuthenticated, async ( req, res ) => {
    const allFormats = await dataLayer.getAllRelated( Format )
    const allGenres = await dataLayer.getAllRelated( Genre )
    const allPublishers = await dataLayer.getAllRelated( Publisher )
    const allTags = await dataLayer.getAllRelated( Tag )
    const allAuthors = await dataLayer.getAllRelated( Author )
    // retrive the book instance with book id
    const book = await dataLayer.getBookById( req.params.book_id )
    // create book form and assign the value of each field from it's corresponding key in the book model instance
    const bookForm = createBookForm( allFormats, allGenres, allPublishers, allTags, allAuthors );
    bookForm.fields.title.value = book.get( "title" );
    bookForm.fields.publishedDate.value = book.get( "publishedDate" );
    bookForm.fields.stock.value = book.get( "stock" );
    bookForm.fields.cost.value = book.get( "cost" );
    bookForm.fields.description.value = book.get( "description" );
    bookForm.fields.format_id.value = book.get( "format_id" );
    bookForm.fields.genre_id.value = book.get( "genre_id" );
    bookForm.fields.publisher_id.value = book.get( "publisher_id" );
    bookForm.fields.imageUrl.value = book.get( "imageUrl" );
    // fill in the multi-select for the tags
    let selectedTags = await book.related( "tags" ).pluck( "id" );
    bookForm.fields.tags.value = selectedTags;
    let selectedAuthors = await book.related( "authors" ).pluck( "id" );
    bookForm.fields.tags.value = selectedAuthors;
    res.render( 'books/update', {
        form: bookForm.toHTML( bootstrapField ),
        book: book.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET

    } )
} )

router.post( "/:book_id/update", checkIfAuthenticated, async ( req, res ) => {
    const allFormats = await dataLayer.getAllRelated( Format )
    const allGenres = await dataLayer.getAllRelated( Genre )
    const allPublishers = await dataLayer.getAllRelated( Publisher )
    const allTags = await dataLayer.getAllRelated( Tag )
    const allAuthors = await dataLayer.getAllRelated( Author )
    // retrive the book instance with book id
    const book = await dataLayer.getBookById( req.params.book_id )
    const bookForm = createBookForm( allFormats, allGenres, allPublishers, allTags, allAuthors );
    bookForm.handle( req, {
        success: async ( form ) => {
            let {
                tags,
                authors,
                ...posterData
            } = form.data;
            // overwrite the original book data with the data from the form
            book.set( posterData );
            // save the new book data
            await book.save();
            // Update the tags
            let selectedTagIds = tags.split( "," ).map( ( i ) => Number( i ) );
            let selectedAuthorIds = authors.split( "," ).map( ( i ) => Number( i ) );
            let existingTagIds = await book.related( "tags" ).pluck( "id" );
            let existingAuthorIds = await book.related( "authors" ).pluck( "id" );

            // remove all the tags that are not selected anymore
            let tagsToRemove = existingTagIds.filter( ( id ) => {
                return selectedTagIds.includes( id ) === false;
            } );
            let authorsToRemove = existingAuthorIds.filter( ( id ) => {
                return selectedAuthorIds.includes( id ) === false;
            } );

            await book.tags().detach( tagsToRemove );
            await book.authors().detach( authorsToRemove );

            // add in all the tags selected in the form
            await book.tags().attach( selectedTagIds );
            await book.authors().attach( selectedAuthorIds );
            req.flash( "success_messages", `Book ${book.title} has been updated` )
            res.redirect( '/books' );
        },
        error: async ( form ) => {
            res.render( 'books/update', {
                'form': form.toHTML( bootstrapField )
            } )
        }


    } )
} )

router.get( "/:book_id/delete", checkIfAuthenticated, async ( req, res ) => {
    // fetch the book that we want to delete
    const book = await dataLayer.getBookById( req.params.book_id )

    res.render( "books/delete", {
        book: book.toJSON()
    } )
} )

router.post( "/:book_id/delete", checkIfAuthenticated, async ( req, res ) => {
    // fetch the book that we want to delete
    const book = await dataLayer.getBookById( req.params.book_id )
    await book.destroy();
    res.redirect( "/books" );
} )

module.exports = router;