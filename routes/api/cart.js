const express = require('express')
const router = express.Router()
const CartServices = require("../../services/cart_services")
const bookDataLayer = require("../../dal/books");
const {
    errorResponse
} = require("../../utils/errorResponse")

const {
    checkIfAuthenticatedJWT
} = require("../../middlewares")
router.get("/", checkIfAuthenticatedJWT, async (req, res) => {
    let cart = new CartServices(parseInt(req.query.customer_id))
    // console.log( cart )
    let result = await cart.getCart()
    if (result) {
        res.status(200).send(result.toJSON())
    } else errorResponse(res)
})

router.get('/add', checkIfAuthenticatedJWT, async (req, res) => {
    let cart = new CartServices(parseInt(req.query.customer_id));
    let result = await cart.addToCart(parseInt(req.query.book_id), 1);
    if (result) {
        res.status(201).send("Yay! Successfully added to cart")
    } else {
        errorResponse(res)
    }
})

router.get("/remove", checkIfAuthenticatedJWT, async (req, res) => {
    let cart = new CartServices(parseInt(req.query.customer_id));
    await bookDataLayer.changeStock(bookId, cartItem.get("quantity"))
    let result = await cart.remove(req.query.book_id);
    if (result) {
        res.status(200).send("Item had been removed")
    } else {
        errorResponse(res)
    }
})

router.post("/quantity/update", checkIfAuthenticatedJWT, async function (req, res) {
    let newQuantity = req.body.new_quantity;
    let cart = new CartServices(parseInt(req.body.customer_id));
    let status = await cart.setQuantity(req.body.book_id, newQuantity);
    // console.log( status );
    if (status) {
        res.status(201).send("Quantity updated");
    } else {
        errorResponse(res, "Error Encountered. Please try Again.", 500);
    }
});
module.exports = router