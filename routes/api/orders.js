const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { errorResponse } = require("./../../utils/errorResponse");
const orderDataLayer = require("../../dal/orders");
const { checkIfAuthenticatedJWT } = require("../../middlewares");

router.get("/", checkIfAuthenticatedJWT, async (req, res) => {
  try {
    let orders = await orderDataLayer.getOrder(req.query.customer_id);
    res.send(orders);
  } catch (err) {
    errorResponse(res);
  }
});

module.exports = router;
