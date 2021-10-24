const express = require( "express" )
const router = express.Router();

const {
    Author
} = require( "./../models" )
const {
    createAuthorForm,
    bootstrapField
} = require( "../forms" );

const {
    checkIfAuthenticated
} = require( "./../middlewares" )
const dataLayer = require( "./../dal/books" )

router.get( "/", checkIfAuthenticated, async ( req, res ) => {

    let authors = await Author.collection().fetch()
    console.log( authors.toJSON() )
    res.render( "authors/index", {
        authors: authors.toJSON(),
        active: {
            Authors: true
        }

    } )
} )

router.get( "/create", checkIfAuthenticated, async ( req, res ) => {
    let authorForm = createAuthorForm()
    res.render( "authors/create", {
        form: authorForm.toHTML( bootstrapField )
    } )
} )

router.post( "/create", checkIfAuthenticated, async ( req, res ) => {
    let authorForm = createAuthorForm()
    authorForm.handle( req, {
        success: async ( form ) => {
            let author = new Author( form.data )
            await author.save()
            req.flash( "success_messages", `New author ${author.toJSON().name} has been added` )
            res.redirect( "/authors" )
        },
        error: async ( form ) => {
            res.render( "authors/create", {
                form: authorForm.toHTML( bootstrapField )
            } )

        }
    } )
} )

router.get( "/:author_id/delete", checkIfAuthenticated, async ( req, res ) => {
    // fetch the author that we want to delete
    const author = await dataLayer.getAuthorById( req.params.author_id, Author )

    res.render( "authors/delete", {
        author: author.toJSON()
    } )
} )


router.post( "/:author_id/delete", checkIfAuthenticated, async ( req, res ) => {
    const author = await dataLayer.getAuthorById( req.params.author_id )
    await author.destroy()
    res.redirect( "/authors" )
} )

module.exports = router