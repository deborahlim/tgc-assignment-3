const bookDataLayer = require('./../dal/books')

const orderDataLayer = require("../dal/orders")
const CartServices = require("./cart_services")
class CheckoutServices {
    constructor(stripeSession) {
        this.stripeSession = stripeSession;
    }

    async processCheckout() {
        let {
            id,
            metadata,
            payment_status,
            amount_total
        } = this.stripeSession

        if (payment_status === "unpaid") {
            payment_status = 4;
        }
        let order = await orderDataLayer.createNewOrder(id, metadata.customer_id, payment_status, amount_total);
        let orderObj = order.toJSON()
        let orderItems = JSON.parse(metadata.orders);
        let cartServices = new CartServices(orderObj.customer_id);
        // add each item to order items table and remove each corresponding cart item
        orderItems.forEach(async (orderItem) => {
            await orderDataLayer.createNewOrderItem(orderObj.id, orderItem.book_id, orderItem.quantity)
            await bookDataLayer.changeStock(orderItem.book_id, orderItem.quantity, this.stripeSession.status);
            await cartServices.remove(orderItem.book_id);
        });
    }

    async updateCheckout() {
        let orderItems = JSON.parse(this.stripeSession.metadata.orders);
        orderDataLayer.updateOrderStatus(this.stripeSession.id, this.stripeSession.status);
        if (this.stripeSession.status === "expired")
            orderItems.forEach(async (orderItem) => {
                await bookDataLayer.changeStock(orderItem.book_id, orderItem.quantity, this.stripeSession.status);
            })

    }

}
module.exports = CheckoutServices;