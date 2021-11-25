const {
    Publisher
} = require("../models");

const getAllPublishers = async () => {
    return await Publisher.collection().fetch({
        withRelated: ["books"]
    })
}

const getPublisherById = async (publisherId) => {
    return await Publisher.where({
        id: parseInt(publisherId)
    }).fetch({
        require: true,
        withRelated: ["books"]
    })
}

module.exports = {
    getAllPublishers,
    getPublisherById
}