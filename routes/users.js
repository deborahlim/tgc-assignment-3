const express = require("express");
const router = express.Router();
const userDataLayer = require("../dal/users")
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
    createUpdateUserAccountForm,
    createLoginForm,
} = require('../forms');

const {
    checkIfAuthenticated,
    checkRoles
} = require("../middlewares")

router.get("/login", async (req, res) => {
    let loginForm = createLoginForm();
    if (req.session.currentUser) {
        res.redirect("/books")
    } else {
        res.render("users/login", {
            form: loginForm.toHTML(bootstrapField)
        })
    }
})

router.post("/login", async (req, res) => {
    const loginForm = createLoginForm();
    loginForm.handle(req, {
        success: async (form) => {
            //process the form
            // find the user by email and password
            let currentUser = await User.where({
                email: form.data.email,
            }).fetch({
                require: false,
                withRelated: ["roles"]
            });

            // console.log( user.toJSON() )
            if (!currentUser) {
                // console.log( "User does not exist" )
                req.flash(
                    "error_messages",
                    "Sorry, the authentication details you have provided does not work"
                );
                res.redirect("/login")
            } else {
                // console.log( "User Exists" )
                if (currentUser.get("password") === getHashedPassword(form.data.password)) {
                    // console.log( req.session.user )
                    req.session.currentUser = {
                        id: currentUser.get("id"),
                        username: currentUser.get("username"),
                        email: currentUser.get("email"),
                        role: currentUser.related("roles").toJSON()
                    };
                    // console.log(req.session.currentUser)
                    req.flash(
                        "success_messages",
                        "Welcome back, " + currentUser.get("username")
                    );
                    // console.log( "LOGIN REQUEST = ", req.session );
                    // console.log( "THE USER IS: ", req.session.user )
                    res.redirect(`/books`);
                } else {
                    // console.log( "Password is not correct" )
                    req.flash(
                        "error_messages",
                        "Sorry, the authentication details you provided does not work"
                    );
                    res.redirect("/");
                }
            }
        },
        error: (form) => {
            req.flash(
                "error_messages",
                "There are some problems with logging you in. Please fill in the form again."
            );
            res.render("landing/index", {
                form: form.toHTML(bootstrapField),
            });
        },
    });
});

router.get("/", checkIfAuthenticated, async (req, res) => {
    let users = await userDataLayer.getAllUsers();
    res.render("users/index", {
        users: users.toJSON(),
        active: {
            Users: true
        }
    })
})

router.get("/register", checkIfAuthenticated, checkRoles(['Owner']), async (req, res) => {
    let allRoles = await userDataLayer.getAllRoles()
    const registerForm = registerUserForm(allRoles);
    res.render("users/register", {
        form: registerForm.toHTML(bootstrapField),
    })
})




router.post('/register', checkIfAuthenticated, checkRoles(['Owner']), async (req, res) => {
    let allRoles = await userDataLayer.getAllRoles()
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
    let currentUser = await userDataLayer.getUserById(req.session.currentUser.id);
    // console.log( user.toJSON() )
    res.render("users/account", {
        currentUser: currentUser.toJSON(),
        active: {
            Account: true
        }
    })
    // console.log(req.session.currentUser)
})

router.get("/:user_id/account/update", checkIfAuthenticated, async (req, res) => {
    let user = await userDataLayer.getUserById(req.params.user_id);
    let updateForm = createUpdateUserAccountForm();
    updateForm.fields.username.value = user.get("username")
    updateForm.fields.email.value = user.get("email")
    res.render("users/updateAccount", {
        user: user.toJSON(),
        form: updateForm.toHTML(bootstrapField)
    })
})

router.post("/:user_id/account/update", checkIfAuthenticated, async (req, res) => {
    let user = await userDataLayer.getUserById(req.params.user_id);
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
    let allRoles = await userDataLayer.getAllRoles()
    const user = await userDataLayer.getUserById(req.params.user_id)
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
    let allRoles = await userDataLayer.getAllRoles()
    let user = await userDataLayer.getUserById(req.params.user_id);
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
    const user = await userDataLayer.getUserById(req.params.user_id)

    res.render("users/delete", {
        user: user.toJSON()
    })
})

router.post("/:user_id/delete", checkIfAuthenticated, checkRoles(['Owner']), async (req, res) => {
    // fetch the user that we want to delete
    const user = await userDataLayer.getUserById(req.params.user_id)
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