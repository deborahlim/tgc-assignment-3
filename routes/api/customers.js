const express = require('express')
const router = express.Router()
const {
    getHashedPassword
} = require("../../utils/hash")
const jwt = require('jsonwebtoken')
const {
    BlacklistedToken
} = require("./../../models")
const {
    errorResponse
} = require("./../../utils/errorResponse")
const {
    Customer
} = require("../../models")
const customerDataLayer = require('../../dal/customers')

const {
    checkIfAuthenticatedJWT
} = require('../../middlewares')

const generateAccessToken = (customer, secret, duration) => {
    // console.log( customer )
    return jwt.sign({
        username: customer.get("username"),
        id: customer.get("id"),
        email: customer.get("email"),
        contact_number: customer.get("contactNumber"),
        address: customer.get("address")


    }, secret, {
        expiresIn: duration
    });
}

router.post("/register", async (req, res) => {
    let checkEmail = await Customer.where({
        email: req.body.email
    }).fetch({
        require: false
    });

    let checkUsername = await Customer.where({
        username: req.body.username
    }).fetch({
        require: false
    });

    if (!checkEmail && !checkUsername) {
        await customerDataLayer.createNewCustomer(req.body);
        res.send({
            message: "Success"
        })
    } else if (checkEmail && checkUsername) {
        return errorResponse(
            res,
            "The email and username provided already exists",
            401
        );
    } else if (checkEmail)
        return errorResponse(res, "The email provided already exists", 406);

    else if (checkValidUsername !== null)
        return errorResponse(res, "The username provided already exists", 409);
})

router.post('/login', async (req, res) => {
    let customer = await Customer.where({
        'email': req.body.email
    }).fetch({
        require: false
    });
    // console.log( customer )
    if (customer && customer.get('password') == getHashedPassword(req.body.password)) {
        let accessToken = generateAccessToken(customer, process.env.TOKEN_SECRET, "15m");
        let refreshToken = generateAccessToken(customer, process.env.REFRESH_TOKEN_SECRET, "3w");
        res.send({
            ...customer.toJSON(),
            accessToken,
            refreshToken
        })
    } else {
        return errorResponse(res, "Your login credentials are incorrect", 401);
    }

})

router.post('/refresh', async function (req, res) {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(401);
    }

    let blacklistedToken = await BlacklistedToken.where({
        'token': refreshToken
    }).fetch({
        'require': false
    })

    // if the refresh token is already black listed
    if (blacklistedToken) {
        res.status(401);
        res.send("The refresh token has already expired");
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (err, payload) {
        if (err) {
            return res.sendStatus(403);
        }
        let accessToken = generateToken(payload, process.env.TOKEN_SECRET, '15m')
        res.send({
                'accessToken': accessToken
            }

        )
    })
})

router.post('/logout', async function (req, res) {
    let refreshToken = req.body.refreshToken;
    if (refreshToken) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async function (err, payload) {
            if (err) {
                return res.sendStatus(403);
            } else {
                const token = new BlacklistedToken();
                token.set('token', refreshToken);
                token.set('date_created', new Date());
                await token.save();
                res.send({
                    'message': 'logged out'
                })
            }
        })
    } else {
        res.sendStatus(401);
    }
})


router.get('/profile', checkIfAuthenticatedJWT, async (req, res) => {
    // console.log( req )
    const customer = req.customer;
    // console.log( customer )
    res.send(customer);
})


module.exports = router;