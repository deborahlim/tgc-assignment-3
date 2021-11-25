const {
    Role,
    User
} = require("../models")

const getAllRoles = async () => {
    return await Role.fetchAll().map((row) => {
        return [row.get("id"), row.get("name")]
    })
}

const getAllUsers = async () => {
    return await User.collection().fetch({
        withRelated: ["roles"]
    })
}

const getUserById = async (userId) => {
    return await User.where({
        id: parseInt(userId)
    }).fetch({
        require: true,
        withRelated: ["roles"]
    })
}

module.exports = {
    getAllRoles,
    getUserById,
    getAllUsers
}