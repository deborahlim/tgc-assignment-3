const {
    Book,
    Publisher,
} = require("../models")

const getAllBooks = async () => {
    return await Book.collection().fetch({
        withRelated: ["authors", "formats", "genres", "tags", "publishers"]
    })
}

const getBookByTitle = async () => {
    Book.collection().where(
        "title", "like", "%" + req.query.title + "%"
    ).fetch({
        withRelated: ["authors", "formats", "genres", "tags", "publishers"]
    });
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

const changeStock = async (bookId, quantity, status) => {
    let book = await Book.where({
        id: parseInt(bookId),
    }).fetch({
        require: true
    });
    if (status === "expired") {
        book.set("stock", book.get("stock") + quantity)
    } else {
        book.set("stock", book.get("stock") - quantity)
    }

    book.save();
}

module.exports = {
    getAllBooks,
    getAllRelated,
    getBookById,
    changeStock,
    getBookByTitle,
}