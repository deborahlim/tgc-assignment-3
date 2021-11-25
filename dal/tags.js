const {
    Tag
} = require("../models");

const getAllTags = async () => {
    return await Tag.collection().fetch({
        withRelated: ["books"]
    })
}

const getTagById = async (tagId) => {
    return await Tag.where({
        id: parseInt(tagId)
    }).fetch({
        require: true,
        withRelated: ["books"]
    })
}

module.exports = {
    getAllTags,
    getTagById
}