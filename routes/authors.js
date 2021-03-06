const express = require("express");
const router = express.Router();

const {
  Author
} = require("./../models");
const {
  createAuthorForm,
  createAuthorSearchForm,
  bootstrapField,
} = require("../forms");

const {
  checkIfAuthenticated,
  checkRoles
} = require("./../middlewares");
const authorDataLayer = require("./../dal/authors");


router.get("/", checkIfAuthenticated, async (req, res) => {
  let q = Author.collection();
  let searchForm = createAuthorSearchForm();

  searchForm.handle(req, {
    empty: async (form) => {
      let authors = await q.fetch();

      res.render("authors/index", {
        authors: authors.toJSON(),
        form: form.toHTML(bootstrapField),
        active: {
          Authors: true,
        },
      });
    },
    error: async (form) => {
      res.render("authors/index", {
        authors: authors.toJSON(),
        form: form.toHTML(bootstrapField),
        active: {
          Authors: true,
        },
      });
    },
    success: async (form) => {
      if (form.data.name) {
        q = q.where("name", "like", "%" + req.query.name + "%");
      }
      let authors = await q.fetch();

      res.render("authors/index", {
        authors: authors.toJSON(),
        form: form.toHTML(bootstrapField),
        active: {
          Authors: true,
        },
      });
    },
  });
  // console.log( authors.toJSON() )
});

router.get(
  "/create",
  checkIfAuthenticated,
  checkRoles(["Manager", "Owner"]),
  async (req, res) => {
    let authorForm = createAuthorForm();
    res.render("authors/create", {
      form: authorForm.toHTML(bootstrapField),
    });
  }
);

router.post(
  "/create",
  checkIfAuthenticated,
  checkRoles(["Manager", "Owner"]),
  async (req, res) => {
    let authorForm = createAuthorForm();
    authorForm.handle(req, {
      success: async (form) => {
        let author = new Author(form.data);
        await author.save();
        req.flash(
          "success_messages",
          `New author ${author.toJSON().name} has been added`
        );
        res.redirect("/authors");
      },
      error: async (form) => {
        res.render("authors/create", {
          form: form.toHTML(bootstrapField),
        });
      },
    });
  }
);

router.get(
  "/:author_id/delete",
  checkIfAuthenticated,
  checkRoles(["Manager", "Owner"]),
  async (req, res) => {
    // fetch the author that we want to delete
    const author = await authorDataLayer.getAuthorById(req.params.author_id);
    const match = await author.related("books");

    if (match.length === 0) {
      res.render("authors/delete", {
        author: author.toJSON(),
      });
    } else {
      req.flash("error_messages", `${author.toJSON().name} cannot be deleted. There are exisiting books by ${author.toJSON().name}`)
      res.redirect("/authors");
    }
  }
);

router.post(
  "/:author_id/delete",
  checkIfAuthenticated,
  checkRoles(["Manager", "Owner"]),
  async (req, res) => {
    const author = await authorDataLayer.getAuthorById(req.params.author_id);
    await author.destroy();
    res.redirect("/authors");
  }
);

module.exports = router;