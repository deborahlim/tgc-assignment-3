const express = require("express")
const router = express.Router();

const ordersDataLayer = require("./../dal/orders");
const {
    createUpdateOrderStatusForm,
    createSearchOrdersForm,
    bootstrapField
} = require("./../forms")
const {
    checkIfAuthenticated,
    checkRoles
} = require("./../middlewares")
const {
    Order
} = require('./../models');
const dataLayer = require("./../dal/orders");


router.get("/", checkIfAuthenticated, async (req, res) => {
    let allOrderStatuses = await ordersDataLayer.getRelatedOrderStatus();
    allOrderStatuses.unshift([0, "All Statuses"]);
    let searchForm = createSearchOrdersForm(allOrderStatuses);
    let q = Order.collection().orderBy("createdAt", "ASC");
    searchForm.handle(req, {
        empty: async (form) => {
            let orders = await q.fetch({
                withRelated: ["customers", "orderStatuses"]
            })

            res.render("orders/index", {
                orders: orders.toJSON(),
                form: form.toHTML(bootstrapField),
                active: {
                    Orders: true
                }
            })
        },
        error: async (form) => {
            let orders = await q.fetch({
                withRelated: ["customers", "orderStatuses"]
            })

            res.render("orders/index", {
                orders: orders.toJSON(),
                form: form.toHTML(bootstrapField),
                active: {
                    Orders: true
                }
            })
        },
        success: async (form) => {
            if (form.data.id) {
                q = q.where("id", "=", form.data.id)
            }

            if (form.data.order_status_id && form.data.order_status_id !== "0") {
                q = q.where("order_status_id", "=", form.data.order_status_id)
            }
            if (form.data.customer_id && form.data.customer_id !== "0") {
                q = q.where("customer_id", "=", form.data.customer_id)
            }
            if (form.data.customerUsername) {
                q = q.query('join', 'customers', 'customer_id', 'customers.id')
                    .where('customers.username', 'like', '%' + form.data.customerUsername + '%')
            }
            if (form.data.minAmount) {
                q = q.where("amountTotal", ">=", form.data.minAmount)
            }

            if (form.data.maxAmount) {
                q = q.where("amountTotal", "<=", form.data.maxAmount)
            }

            if (form.data.createdDateFrom) {
                q = q.where("publishedDate", ">=", form.data.createdDateFrom)
            }

            if (form.data.createdDateTo) {
                q = q.where("publishedDate", "<=", form.data.createdDateTo)
            }
            let orders = await q.fetch({
                withRelated: ["customers", "orderStatuses"]
            })

            res.render("orders/index", {
                orders: orders.toJSON(),
                form: form.toHTML(bootstrapField),
                active: {
                    Orders: true
                }
            })

        },
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