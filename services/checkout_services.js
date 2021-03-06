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
            payment_status,
            metadata,
            amount_total,
        } = this.stripeSession
        // status = unpaid
        let status = 4;
        amount_total = (amount_total / 100).toFixed(2)
        let order = await orderDataLayer.createNewOrder(id, metadata.customer_id, amount_total, status);
        console.log(order.toJSON());
        let orderObj = order.toJSON()
        let orderItems = JSON.parse(metadata.orders);
        let cartServices = new CartServices(orderObj.customer_id);
        // add each item to order items table and remove each corresponding cart item
        orderItems.forEach(async (orderItem) => {
            await orderDataLayer.createNewOrderItem(orderObj.id, orderItem.book_id, orderItem.quantity)
            await bookDataLayer.changeStock(orderItem.book_id, orderItem.quantity, payment_status);
            await cartServices.remove(orderItem.book_id);
        });
    }

    async updateCheckout() {
        let {
            id,
            metadata,
            status,
            amount_total,
            shipping,
            total_details
        } = this.stripeSession
        let orderItems = JSON.parse(metadata.orders);
        amount_total = (amount_total / 100).toFixed(2)
        let shippingAddress;
        if (shipping) {
            shippingAddress = shipping.address.line1 + ", Singapore " + shipping.address.postal_code;
        }
        if (status === "complete") {
            orderDataLayer.updateOrderStatus(id, status, amount_total, shippingAddress, total_details.amount_shipping);
        }
        if (status === "expired")
            orderItems.forEach(async (orderItem) => {
                await bookDataLayer.changeStock(orderItem.book_id, orderItem.quantity, status);
            })
    }

}
module.exports = CheckoutServices;