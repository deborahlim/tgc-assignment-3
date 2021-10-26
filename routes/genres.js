const express = require( "express" )
const router = express.Router();

const {
    Genre
} = require( "../models" )
const {
    createGenreForm,
    bootstrapField
} = require( "../forms" );

const {
    checkIfAuthenticated,
    checkRoles
} = require( "../middlewares" )
const dataLayer = require( "../dal/books" )

router.get( "/", checkIfAuthenticated, async ( req, res ) => {

    let genres = await Genre.collection().fetch()
    // console.log( genres.toJSON() )
    res.render( "genres/index", {
        genres: genres.toJSON(),
        active: {
            Genres: true
        }

    } )
} )

router.get( "/create", checkIfAuthenticated, checkRoles( [ "Manager", "Owner" ] ), async ( req, res ) => {
    let genreForm = createGenreForm()
    res.render( "genres/create", {
        form: genreForm.toHTML( bootstrapField )
    } )
} )

router.post( "/create", checkIfAuthenticated, checkRoles( [ "Manager", "Owner" ] ), async ( req, res ) => {
    let genreForm = createGenreForm()
    genreForm.handle( req, {
        success: async ( form ) => {
            let genre = new Genre( form.data )
            await genre.save()
            req.flash( "success_messages", `New genre ${genre.toJSON().name} has been added` )
            res.redirect( "/genres" )
        },
        error: async ( form ) => {
            res.render( "genres/create", {
                form: genreForm.toHTML( bootstrapField )
            } )

        }
    } )
} )

router.get( "/:genre_id/delete", checkIfAuthenticated, checkRoles( [ "Manager", "Owner" ] ), async ( req, res ) => {
    // fetch the genre that we want to delete
    const genre = await dataLayer.getGenreById( req.params.genre_id )

    res.render( "genres/delete", {
        genre: genre.toJSON()
    } )
} )


router.post( "/:genre_id/delete", checkIfAuthenticated, checkRoles( [ "Manager", "Owner" ] ), async ( req, res ) => {
    const genre = await dataLayer.getGenreById( req.params.genre_id )
    await genre.destroy()
    res.redirect( "/genres" )
} )

module.exports = router