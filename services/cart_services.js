const cartDataLayer = require('../dal/cart_items')
const bookDataLayer = require("../dal/books")
class CartServices {
    constructor(customer_id) {
        this.customer_id = customer_id;
    }

    async addToCart(bookId, quantity) {
        // check if there is stock
        let book = await bookDataLayer.getBookById(bookId)
        let currentStock = book.get("stock")
        if (currentStock === 0) return false;
        // check if the user has added the book to the shopping cart before
        let cartItem = await cartDataLayer
            .getCartItemByCustomerAndBook(this.customer_id, bookId);
        if (cartItem) {
            let currentQuantity = cartItem.get("quantity");
            if (currentQuantity + 1 > currentStock) {
                return false;
            }
            return await cartDataLayer
                .updateQuantity(this.customer_id, bookId, currentQuantity + 1);
        } else {
            let newCartItem = cartDataLayer.
            createCartItem(this.customer_id, bookId, quantity);
            return newCartItem;
        }
    }

    async remove(bookId) {
        return await cartDataLayer
            .removeFromCart(this.customer_id, bookId);
    }


    async setQuantity(bookId, quantity) {
        let book = await bookDataLayer.getBookById(bookId)
        let currentStock = book.get("stock")
        if (quantity > currentStock) {
            return false;
        }
        return await cartDataLayer
            .updateQuantity(this.customer_id, bookId, quantity);
    }

    async getCart() {
        return await cartDataLayer.getCart(this.customer_id);
    }


}
module.exports = CartServices;