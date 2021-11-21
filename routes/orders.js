const express = require("express")
const router = express.Router();

const ordersDataLayer = require("./../dal/orders");
const {
    createUpdateOrderStatusForm,
    bootstrapField
} = require("./../forms")
const {
    checkIfAuthenticated,
    checkRoles
} = require("./../middlewares")
const dataLayer = require("./../dal/orders");
const {
    route
} = require("./authors");

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

router.get("/:order_id/update", checkIfAuthenticated, checkRoles(["Manager", "Owner"]), async (req, res) => {
    const allOrderStatuses = await ordersDataLayer.getRelatedOrderStatus();
    console.log(allOrderStatuses)
    const orderForm = createUpdateOrderStatusForm(allOrderStatuses)
    const order = await ordersDataLayer.getOrderById(req.params.order_id);
    orderForm.fields.status.value = order.get("order_status_id");
    res.render("orders/update", {
        form: orderForm.toHTML(bootstrapField),
        order: order.toJSON()
    })
})

router.post("/:order_id/update", checkIfAuthenticated, checkRoles(["Manager", "Owner"]), async (req, res) => {
    const allOrderStatuses = ordersDataLayer.getRelatedOrderStatus();
    const orderForm = createUpdateOrderStatusForm(allOrderStatuses)
    const order = await ordersDataLayer.getOrderById(req.params.order_id);
    orderForm.handle(req, {
        success: async (form) => {
            order.set("order_status_id", form.data.status);
            await order.save();
            req.flash("success_messages", `Order ${order.toJSON().id} has been updated`)
            res.redirect('/orders');
        },
        error: async (form) => {
            res.render('orders/update', {
                'form': form.toHTML(bootstrapField)
            })
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