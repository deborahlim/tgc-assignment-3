const express = require('express')
const router = express.Router();
const booksDataLayer = require('../../dal/books')


// Return all books
router.get('/', async (req, res) => {
    let books = await booksDataLayer.getAllBooks()
    res.send(books);
})

router.get("/selected", async (req, res) => {
    let selectedBooks = await booksDataLayer.getBookByTitle(req.query.title)
    res.send(selectedBooks)
})
module.exports = router;