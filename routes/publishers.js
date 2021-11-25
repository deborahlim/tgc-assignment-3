const express = require("express")
const router = express.Router();

const {
    Publisher
} = require("./../models")
const {
    createPublisherForm,
    bootstrapField
} = require("../forms");

const {
    checkIfAuthenticated,
    checkRoles
} = require("./../middlewares")
const dataLayer = require("./../dal/books")

router.get("/", checkIfAuthenticated, async (req, res) => {

    let publishers = await Publisher.collection().fetch()
    // console.log(publishers.toJSON())
    res.render("publishers/index", {
        publishers: publishers.toJSON(),
        active: {
            Publishers: true
        }

    })
})

router.get("/create", checkIfAuthenticated, checkRoles(["Manager", "Owner"]), async (req, res) => {
    let publisherForm = createPublisherForm()
    res.render("publishers/create", {
        form: publisherForm.toHTML(bootstrapField)
    })
})

router.post("/create", checkIfAuthenticated, checkRoles(["Manager", "Owner"]), async (req, res) => {
    let publisherForm = createPublisherForm()
    publisherForm.handle(req, {
        success: async (form) => {
            let publisher = new Publisher(form.data)
            await publisher.save()
            req.flash("success_messages", `New publisher ${publisher.toJSON().name} has been added`)
            res.redirect("/publishers")
        },
        error: async (form) => {
            res.render("publishers/create", {
                form: publisherForm.toHTML(bootstrapField)
            })

        }
    })
})

router.get("/:publisher_id/delete", checkIfAuthenticated, checkRoles(["Manager", "Owner"]), async (req, res) => {
    // fetch the publisher that we want to delete
    const publisher = await dataLayer.getPublisherById(req.params.publisher_id)
    const match = await publisher.related("books");
    if (match.length === 0) {
        res.render("publishers/delete", {
            publisher: publisher.toJSON()
        })
    } else {
        req.flash("error_messages", `${publisher.toJSON().name} cannot be deleted. There are exisiting books published by ${publisher.toJSON().name}`)
        res.redirect("/publishers");
    }
})


router.post("/:publisher_id/delete", checkIfAuthenticated, checkRoles(["Manager", "Owner"]), async (req, res) => {
    const publisher = await dataLayer.getPublisherById(req.params.publisher_id)
    await publisher.destroy()
    res.redirect("/publishers")
})

module.exports = router