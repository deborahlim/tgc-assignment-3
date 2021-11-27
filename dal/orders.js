const {
    Order,
    OrderItem,
    OrderStatus
} = require("../models")

const getAllOrders = async () => {
    return await Order.collection().orderBy("createdAt", "ASC").fetch({
        withRelated: ["customers", "orderStatuses"]
    })
}


const getRelatedOrderStatus = async () => {
    return await OrderStatus.fetchAll().map((row) => {
        return [row.get("id"), row.get("name")]
    })
}

const updateOrderStatus = async (id, newStatus, amountTotal, shippingAddress, shippingCost) => {
    console.log(newStatus, shippingAddress, shippingCost);
    let order = await getOrderById(id)
    // console.log(order)
    // console.log(order.toJSON());
    if (newStatus === "complete") {
        await order.set("order_status_id", 1)
        await order.set("amountTotal", amountTotal)
        await order.set("shippingAddress", shippingAddress)
        await order.set("shippingCost", shippingCost / 100)
    } else if (newStatus === "expired" || newStatus === "unpaid") {
        await order.set("order_status_id", 4)
    }
    await order.save();
}

const createNewOrder = async (id, customerId, amountTotal, status) => {
    let order = new Order({
        id: id,
        customer_id: customerId,
        amountTotal: amountTotal,
        order_status_id: status,
    })
    order.set("createdAt", new Date());
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
    }).orderBy("createdAt", "ASC").fetch({
        require: false,
        withRelated: ["orderItems.books.formats", "orderItems.books.publishers", "orderItems.books.authors", "orderStatuses"]
    });
}

const getOrderById = async (orderId) => {
    return await Order.where({
        id: orderId
    }).fetch({
        require: false,
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
    // console.log("ORDER:", order.toJSON());
    // console.log("ORDER ITEMS:", orderItemsArr);

    let orderItems = await getOrderItemByOrder(orderId)
    if (order && orderItems) {
        await orderItems.destroy();
        await order.destroy();
        return true
    } else {
        return false;
    }

}

module.exports = {
    getAllOrders,
    createNewOrder,
    createNewOrderItem,
    getOrder,
    getOrderById,
    getOrderItemByOrder,
    getOrderItemByBookId,
    deleteOrder,
    getRelatedOrderStatus,
    updateOrderStatus
}