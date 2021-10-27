const {
    CartItem
} = require( '../models' );

const getCart = async ( customerId ) => {
    return await CartItem.collection()
        .where( {
            'customer_id': customerId
        } ).fetch( {
            require: false,
            withRelated: [ 'books' ]
        } );
}

const getCartItemByCustomerAndBook = async ( customerId, bookId ) => {
    return await CartItem.where( {
        'customer_id': customerId,
        'book_id': bookId
    } ).fetch( {
        require: false
    } );
}

const createCartItem = async ( customerId, bookId, quantity ) => {

    let cartItem = new CartItem( {
        'customer_id': customerId,
        'book_id': bookId,
        'quantity': quantity
    } )
    await cartItem.save();
    return cartItem;
}

const removeFromCart = async ( customerId, bookId ) => {
    let cartItem = await getCartItemBycustomerAndBook( customerId, bookId );
    if ( cartItem ) {
        await cartItem.destroy();
        return true;
    }
    return false;
}

const updateQuantity = async ( customerId, bookId, newQuantity ) => {
    let cartItem = await getCartItemBycustomerAndBook( customerId, bookId );
    if ( cartItem ) {
        cartItem.set( 'quantity', newQuantity );
        cartItem.save();
        return true;
    }
    return false;
}



module.exports = {
    getCart,
    getCartItemByCustomerAndBook,
    createCartItem,
    removeFromCart,
    updateQuantity
}