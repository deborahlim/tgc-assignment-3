const express = require("express")
const router = express.Router();


const {
    checkIfAuthenticated,
    checkRoles
} = require("./../middlewares")
const dataLayer = require("./../dal/orders")

router.get("/", checkIfAuthenticated, async (req, res) => {

    let orders = await dataLayer.getAllOrders()
    // console.log(orders.toJSON());
    res.render("orders/index", {
        orders: orders.toJSON(),
        active: {
            Orders: true
        }

    })
})

router.get("/:order_id/delete", checkIfAuthenticated, checkRoles(["Manager", "Owner"]), async (req, res) => {
    let order = await dataLayer.getOrderById(req.params.order_id)
    // console.log(order.toJSON())
    res.render("orders/delete", {
        order: order.toJSON()
    })
})


router.post("/:order_id/delete", checkIfAuthenticated, checkRoles(["Manager", "Owner"]), async (req, res) => {
    let result = await dataLayer.deleteOrder(req.params.order_id);
    if (result) {
        req.flash("success_messages", "The order was successfully deleted.")
        res.redirect("/orders")
    } else {
        req.flash("error_messages", "Something went wrong. Please try again.")
        res.redirect("/orders")
    }

})

module.exports = router