const {
    Book,
    Author
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

module.exports = {
    getAllRelated,
    getBookById,
    getAuthorById
}