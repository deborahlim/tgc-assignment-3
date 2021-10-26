const {
    Role,
    User
} = require( "../models" )

const getAllRoles = async () => {
    return await Role.fetchAll().map( ( row ) => {
        return [ row.get( "id" ), row.get( "name" ) ]
    } )
}

const getUserById = async ( userId ) => {
    return await User.where( {
        id: parseInt( userId )
    } ).fetch( {
        require: true,
        withRelated: [ "roles" ]
    } )
}

module.exports = {
    getAllRoles,
    getUserById
}