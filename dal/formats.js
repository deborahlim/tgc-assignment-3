const {
    Format
} = require("../models");

const getAllFormats = async () => {
    return await Format.collection().fetch({
        withRelated: ["books"]
    })
}

const getFormatById = async (formatId) => {
    return await Format.where({
        id: parseInt(formatId)
    }).fetch({
        require: true,
        withRelated: ["books"]
    })
}

module.exports = {
    getAllFormats,
    getFormatById
}