const express = require("express");
const router = express.Router();
const dataLayer = require("../dal/users")
const {
    getHashedPassword
} = require("../utils/hash")

// import in the User model
const {
    User
} = require('../models');

const {
    registerUserForm,
    bootstrapField,
    createUpdateUserForm,
    createUpdateUserAccountForm
} = require('../forms');

const {
    checkIfAuthenticated,
    checkRoles
} = require("../middlewares")

router.get("/", checkIfAuthenticated, async (req, res) => {
    let users = await User.collection().fetch({
        withRelated: ["roles"]
    });
    res.render("users/index", {
        users: users.toJSON(),
        active: {
            Users: true
        }
    })
})

router.get("/register", checkIfAuthenticated, checkRoles(['Owner']), async (req, res) => {
    let allRoles = await dataLayer.getAllRoles()
    const registerForm = registerUserForm(allRoles);
    res.render("users/register", {
        form: registerForm.toHTML(bootstrapField),
    })
})

router.post('/register', checkIfAuthenticated, checkRoles(['Owner']), async (req, res) => {
    let allRoles = await dataLayer.getAllRoles()
    const registerForm = registerUserForm(allRoles);

    registerForm.handle(req, {
        success: async (form) => {
            const user = new User({
                'username': form.data.username,
                'password': getHashedPassword(form.data.password),
                'email': form.data.email,
                'role_id': form.data.role_id
            });
            // console.log(user.toJSON());
            await user.save();
            req.flash("success_messages", "User has been registered successfully")
            res.redirect('/users')
        },
        error: async (form) => {
            req.flash(
                "error_messages",
                "An error occured while creating a new user. Please fill in the form again."
            );
            res.render("users/register", {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})



router.get("/:user_id/account", checkIfAuthenticated, async (req, res) => {
    let currentUser = await dataLayer.getUserById(req.session.currentUser.id);
    // console.log( user.toJSON() )
    res.render("users/account", {
        currentUser: currentUser.toJSON()
    })
    // console.log(req.session.currentUser)
})

router.get("/:user_id/account/update", checkIfAuthenticated, async (req, res) => {
    let user = await dataLayer.getUserById(req.params.user_id);
    let updateForm = createUpdateUserAccountForm();
    updateForm.fields.username.value = user.get("username")
    updateForm.fields.email.value = user.get("email")
    res.render("users/updateAccount", {
        user: user.toJSON(),
        form: updateForm.toHTML(bootstrapField)
    })
})

router.post("/:user_id/account/update", checkIfAuthenticated, async (req, res) => {
    let user = await dataLayer.getUserById(req.params.user_id);
    let updateAccountForm = createUpdateUserAccountForm();
    updateAccountForm.handle(req, {
        success: async (form) => {
            if (getHashedPassword(form.data.old_password) !== user.get("password")) {
                req.flash("error_messages", "Your old password is incorrect. Please try again.")
                res.redirect(`/users/${req.params.user_id}/account/update`)
            } else {
                user.set("username", form.data.username);
                user.set("email", form.data.email);
                user.set("password", getHashedPassword(form.data.new_password));
                await user.save()
                req.flash("success_messages", `Your account details has been updated`)
                res.redirect(`/users/${user.id}/account`)
            }

        },
        error: async (form) => {
            req.flash(
                "error_messages",
                "There are some problems with updating your account details. Please fill in the form again."
            );
            res.render("users/updateAccount", {
                user: user.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        }
    })

})

router.get("/:user_id/update", checkIfAuthenticated, checkRoles(["Owner"]), async (req, res) => {
    let allRoles = await dataLayer.getAllRoles()
    const user = await dataLayer.getUserById(req.params.user_id)
    const updateUserForm = createUpdateUserForm(allRoles)
    updateUserForm.fields.username.value = user.get("username")
    updateUserForm.fields.email.value = user.get("email")
    updateUserForm.fields.role_id.value = user.get("role_id")
    res.render("users/updateUser", {
        user: user.toJSON(),
        form: updateUserForm.toHTML(bootstrapField)
    })

})

router.post("/:user_id/update", checkIfAuthenticated, checkRoles(["Owner"]), async (req, res) => {
    let allRoles = await dataLayer.getAllRoles()
    let user = await dataLayer.getUserById(req.params.user_id);
    let updateForm = createUpdateUserForm(allRoles);
    updateForm.handle(req, {
        success: async (form) => {
            user.set("username", form.data.username);
            user.set("email", form.data.email);
            // console.log(form.data.new_password)

            user.set("password", getHashedPassword(form.data.new_password));

            user.set("role_id", form.data.role_id)
            // console.log(user.toJSON())
            await user.save()
            req.flash("success_messages", `${user.toJSON().username}'s details has been updated`)
            res.redirect("/users")
        },
        error: async (form) => {
            req.flash(
                "error_messages",
                "An error orccured. Please fill in the form again."
            );
            res.render("users/updateUser", {
                user: user.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get("/:user_id/delete", checkIfAuthenticated, checkRoles(['Owner']), async (req, res) => {
    // fetch the user that we want to delete
    const user = await dataLayer.getUserById(req.params.user_id)

    res.render("users/delete", {
        user: user.toJSON()
    })
})

router.post("/:user_id/delete", checkIfAuthenticated, checkRoles(['Owner']), async (req, res) => {
    // fetch the user that we want to delete
    const user = await dataLayer.getUserById(req.params.user_id)
    await user.destroy();
    res.redirect("/users");
})

router.get("/logout", checkIfAuthenticated, async (req, res) => {
    req.session.currentUser = null;
    res.locals.currentUser = null;
    req.flash('success_messages', "Goodbye");
    res.redirect("/");
})

module.exports =
    router