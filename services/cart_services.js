const cartDataLayer = require( '../dal/cart_items' )

class CartServices {
    constructor( customer_id ) {
        this.customer_id = customer_id;
    }

    async addToCart( bookId, quantity ) {
        // check if the user has added the book to the shopping cart before
        let cartItem = await cartDataLayer
            .getCartItemByCustomerAndBook( this.customer_id, bookId );
        if ( cartItem ) {
            return await cartDataLayer
                .updateQuantity( this.customer_id, bookId, cartItem.get( 'quantity' ) + 1 );
        } else {
            let newCartItem = cartDataLayer.
            createCartItem( this.customer_id, bookId, quantity );
            return newCartItem;
        }
    }

    async remove( bookId ) {
        return await cartDataLayer
            .removeFromCart( this.customer_id, bookId );
    }


    async setQuantity( bookId, quantity ) {
        return await cartDataLayer
            .updateQuantity( this.customer_id, bookId, quantity );
    }

    async getCart() {
        return await cartDataLayer.getCart( this.customer_id );
    }


}
module.exports = CartServices;