const {
    Order,
    OrderItem,
} = require("../models")

const createNewOrder = async (id, customerId, status, amountTotal) => {
    let order = new Order({
        id: id,
        customer_id: customerId,
        status: status,
        amountTotal: amountTotal
    })

    await order.save(null, {method: 'insert'});
    return order;
}

const createNewOrderItem = async(orderId, bookId, quantity) => {
    let orderItem = new OrderItem({
        order_id: orderId,
        book_id: bookId,
        quantity: quantity
    })
    await orderItem.save();
    return orderItem
}

const getOrder = async(customerId) => {
    return await Order.collection().where({
        customer_id: customerId
    }).fetch({
        require: false,
        withRelated: ["orderItems.books.formats", "orderItems.books.publishers", "orderItems.books.authors"]
    });
}

const getOrderItemByOrder = async (orderId) => {
    return await OrderItem.where({
        order_id: orderId
    }).fetch({
        require: false,
        withRelated: ["books"]
    })
}

module.exports = {
    createNewOrder,
    createNewOrderItem,
    getOrder,
    getOrderItemByOrder
}