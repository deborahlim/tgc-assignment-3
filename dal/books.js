const {
    Book,
    Author,
    Publisher,
    Genre
} = require( "../models" )

const getAllRelated = async ( model ) => {
    return await model.fetchAll().map( ( row ) => {
        return [ row.get( "id" ), row.get( "name" ) ]
    } )
}

const getBookById = async ( bookId ) => {
    return await Book.where( {
        id: parseInt( bookId )
    } ).fetch( {
        require: true,
        withRelated: [ "tags", "authors" ]
    } )
}

const getAuthorById = async ( authorId ) => {
    return await Author.where( {
        id: parseInt( authorId )
    } ).fetch( {
        require: true,
    } )
}

const getPublisherById = async ( publisherId ) => {
    return await Publisher.where( {
        id: parseInt( publisherId )
    } ).fetch( {
        require: true,
    } )
}

const getGenreById = async ( genreId ) => {
    return await Genre.where( {
        id: parseInt( genreId )
    } ).fetch( {
        require: true,
    } )
}

module.exports = {
    getAllRelated,
    getBookById,
    getAuthorById,
    getPublisherById,
    getGenreById
}