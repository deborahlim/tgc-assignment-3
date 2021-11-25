const express = require("express");
const router = express.Router();
const {
    createRegisterOwnerForm,
    bootstrapField
} = require("../forms")
const {
    getHashedPassword
} = require("../utils/hash")
const {
    User
} = require('../models');
const userDataLayer = require("../dal/users")
router.get("/", async (req, res) => {
    let users = await userDataLayer.getAllUsers();
    if (users.length === 0) {
        const registerForm = createRegisterOwnerForm();
        res.render("landing/index", {
            form: registerForm.toHTML(bootstrapField),
        })
    } else {
        res.redirect("/users/login");
    }
})


router.post("/", async (req, res) => {
    const registerForm = createRegisterOwnerForm();
    registerForm.handle(req, {
        success: async (form) => {
            const user = new User({
                'username': form.data.username,
                'password': getHashedPassword(form.data.password),
                'email': form.data.email,
                'role_id': 1
            });
            // console.log(user.toJSON());
            await user.save();
            req.flash("success_messages", "Owner has been registered successfully")
            res.redirect('/users')
        },
        error: async (form) => {
            req.flash(
                "error_messages",
                "An error occured while creating a new owner. Please fill in the form again."
            );
            res.render("landing/index", {
                form: form.toHTML(bootstrapField)
            })
        }
    })
});


module.exports = router;