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


module.exports = {
    createNewCustomer
}