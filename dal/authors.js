const {
    Author
} = require("../models");

const getAllAuthors = async () => {
    return await Author.collection().fetch({
        withRelated: ["books"]
    })
}

const getAuthorById = async (authorId) => {
    return await Author.where({
        id: parseInt(authorId)
    }).fetch({
        require: true,
        withRelated: ["books"]
    })
}

module.exports = {
    getAllAuthors,
    getAuthorById
}