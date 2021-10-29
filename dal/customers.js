const {
    Customer
} = require( "../models" );

const crypto = require( 'crypto' )
const getHashedPassword = ( password ) => {
    const sha256 = crypto.createHash( 'sha256' );
    const hash = sha256.update( password ).digest( 'base64' );
    return hash;
}
const createNewCustomer = async ( obj ) => {

    console.log( getCustomerByUsername( obj.username ) )

    let customer = new Customer( {
        username: obj.username,
        password: getHashedPassword( obj.password ),
        email: obj.email,
        contactNumber: obj.contactNumber,
        address: obj.address


    } )
    await customer.save();
    return customer
}

const getCustomerByUsername = async ( username ) => {
    return await Customer.where( {
        username: username
    } ).fetch( {
        require: false,
    } )
}

module.exports = {
    createNewCustomer,
    getCustomerByUsername
}