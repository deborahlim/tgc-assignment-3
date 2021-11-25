const {
    Genre
} = require("../models");

const getAllGenres = async () => {
    return await Genre.collection().fetch({
        withRelated: ["books"]
    })
}

const getGenreById = async (genreId) => {
    return await Genre.where({
        id: parseInt(genreId)
    }).fetch({
        require: true,
        withRelated: ["books"]
    })
}

module.exports = {
    getAllGenres,
    getGenreById
}