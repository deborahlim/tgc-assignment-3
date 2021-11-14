const {
    Book,
    Author,
    Publisher,
    Genre,
    Tag
} = require("../models")

const getAllBooks = async () => {
    return await Book.collection().fetch({
        withRelated: ["authors", "formats", "genres", "tags", "publishers"]
    })
}
const getAllRelated = async (model) => {
    return await model.fetchAll().map((row) => {
        return [row.get("id"), row.get("name")]
    })
}

const getBookById = async (bookId) => {
    return await Book.where({
        id: parseInt(bookId)
    }).fetch({
        require: true,
        withRelated: ["tags", "authors"]
    })
}

const getAuthorById = async (authorId) => {
    return await Author.where({
        id: parseInt(authorId)
    }).fetch({
        require: true,
    })
}

const getPublisherById = async (publisherId) => {
    return await Publisher.where({
        id: parseInt(publisherId)
    }).fetch({
        require: true,
    })
}

const getGenreById = async (genreId) => {
    return await Genre.where({
        id: parseInt(genreId)
    }).fetch({
        require: true,
    })
}

const getTagById = async (tagId) => {
    return await Tag.where({
        id: parseInt(tagId)
    }).fetch({
        require: true,
    })
}

const changeStock = async (bookId, quantity) => {
    let book = await Book.where({
        id: parseInt(bookId),
    }).fetch({
        require: true
    });
    book.set("stock", book.get("stock") - quantity)
    book.save();
}

module.exports = {
    getAllBooks,
    getAllRelated,
    getBookById,
    getAuthorById,
    getPublisherById,
    getGenreById,
    getTagById,
    changeStock
}