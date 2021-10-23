const {
    Role
} = require("../models")

const getAllRoles = async () => {
    return await Role.fetchAll().map((row) => {
        return [row.get("id"), row.get("name")]
    })
}

module.exports = {
    getAllRoles
}