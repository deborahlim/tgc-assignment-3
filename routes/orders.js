const express = require("express")
const router = express.Router();

const {
    Order
} = require("./../models")

const {
    checkIfAuthenticated,
    checkRoles
} = require("./../middlewares")
const dataLayer = require("./../dal/orders")

router.get("/", checkIfAuthenticated, async (req, res) => {

    let orders = await dataLayer.getAllOrders()
    console.log(orders.toJSON());
    res.render("orders/index", {
        orders: orders.toJSON(),
        active: {
            Orders: true
        }

    })
})

router.get("/:order_id/delete", checkIfAuthenticated, checkRoles(["Manager", "Owner"]), async (req, res) => {
    // fetch the publisher that we want to delete
    const order = await dataLayer.getorderById(req.params.order_id)

    res.render("order/delete", {
        order: order.toJSON()
    })
})


router.post("/:order_id/delete", checkIfAuthenticated, checkRoles(["Manager", "Owner"]), async (req, res) => {
    const order = await dataLayer.getorderById(req.params.order_id)
    const orderItems = await dataLayer.getOrder
    await order.destroy()
    res.redirect("/order")
})

module.exports = router