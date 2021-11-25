const express = require("express")
const router = express.Router();

const {
    Tag
} = require("../models")
const {
    createTagForm,
    bootstrapField
} = require("../forms");

const {
    checkIfAuthenticated,
    checkRoles
} = require("../middlewares")
const dataLayer = require("../dal/books")

router.get("/", checkIfAuthenticated, async (req, res) => {

    let tags = await Tag.collection().fetch()
    // console.log( tags.toJSON() )
    res.render("tags/index", {
        tags: tags.toJSON(),
        active: {
            Tags: true
        }

    })
})

router.get("/create", checkIfAuthenticated, checkRoles(["Manager", "Owner"]), async (req, res) => {
    let tagForm = createTagForm()
    res.render("tags/create", {
        form: tagForm.toHTML(bootstrapField)
    })
})

router.post("/create", checkIfAuthenticated, checkRoles(["Manager", "Owner"]), async (req, res) => {
    let tagForm = createTagForm()
    tagForm.handle(req, {
        success: async (form) => {
            let tag = new Tag(form.data)
            await tag.save()
            req.flash("success_messages", `New tag ${tag.toJSON().name} has been added`)
            res.redirect("/tags")
        },
        error: async (form) => {
            res.render("tags/create", {
                form: tagForm.toHTML(bootstrapField)
            })

        }
    })
})

router.get("/:tag_id/delete", checkIfAuthenticated, checkRoles(["Manager", "Owner"]), async (req, res) => {
    // fetch the tag that we want to delete
    const tag = await dataLayer.getTagById(req.params.tag_id)
    res.render("tags/delete", {
        tag: tag.toJSON()
    })
})


router.post("/:tag_id/delete", checkIfAuthenticated, checkRoles(["Manager", "Owner"]), async (req, res) => {
    const tag = await dataLayer.getTagById(req.params.tag_id)
    await tag.destroy()
    res.redirect("/tags")
})

module.exports = router