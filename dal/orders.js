const {
    Order,
    OrderItem,
} = require("../models")

const getAllOrders = async () => {
    return await Order.collection().fetch({
        withRelated: ["customers"]
    })
}

const createNewOrder = async (id, customerId, status, amountTotal) => {
    let order = new Order({
        id: id,
        customer_id: customerId,
        status: status,
        amountTotal: amountTotal
    })

    await order.save(null, {
        method: 'insert'
    });
    return order;
}

const createNewOrderItem = async (orderId, bookId, quantity) => {
    let orderItem = new OrderItem({
        order_id: orderId,
        book_id: bookId,
        quantity: quantity
    })
    await orderItem.save();
    return orderItem
}

const getOrder = async (customerId) => {
    return await Order.collection().where({
        customer_id: customerId
    }).fetch({
        require: false,
        withRelated: ["orderItems.books.formats", "orderItems.books.publishers", "orderItems.books.authors"]
    });
}

const getOrderById = async (orderId) => {
    return await Order.where({
        id: orderId
    }).fetch({
        require: true,
        withRelated: ["orderItems"]
    });
}

const getOrderItemByOrder = async (orderId) => {
    return await OrderItem.where({
        order_id: orderId
    }).fetch({
        require: true,
        withRelated: ["books"]
    })
}

const getOrderItemByBookId = async (bookId) => {
    return await OrderItem.where({
        book_id: bookId,
    }).fetch({
        require: false,
    })
}

const deleteOrder = async (orderId) => {
    let order = await getOrderById(orderId);
    // let orderItems = await getOrderItemByOrder(orderId)
    let orderItemsArr = order.toJSON().orderItems
    // console.log("ORDER:", order.toJSON());
    // console.log("ORDER ITEMS:", orderItemsArr);

    let orderItems = await getOrderItemByOrder(orderId)
    await orderItems.destroy();

    await order.destroy();
}

module.exports = {
    getAllOrders,
    createNewOrder,
    createNewOrderItem,
    getOrder,
    getOrderById,
    getOrderItemByOrder,
    getOrderItemByBookId,
    deleteOrder
}