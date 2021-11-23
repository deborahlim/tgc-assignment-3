const cartDataLayer = require('../dal/cart_items')

const orderDataLayer = require("../dal/orders")
const CartServices = require("./cart_services")
class CheckoutServices {
    constructor(session_id) {
        this.session_id = session_id;
    }

    async process_checkout(stripeSession, status) {
        let {
            id,
            metadata,
            payment_status,
            amount_total
        } = stripeSession

        if (status === "unpaid") {
            payment_status = 4;
        }
        let order = await orderDataLayer.createNewOrder(id, metadata.customer_id, payment_status, amount_total);
        let orderObj = order.toJSON()
        let orderItems = JSON.parse(metadata.orders);
        let cartServices = new CartServices(orderObj.customer_id);
        // add each item to order items table and remove each corresponding cart item
        orderItems.forEach(async (orderItem) => {
            await orderDataLayer.createNewOrderItem(orderObj.id, orderItem.book_id, orderItem.quantity)
            await cartServices.remove(orderItem.book_id);
        });
    }

}
module.exports = CheckoutServices;