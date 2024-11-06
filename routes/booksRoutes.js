const express = require('express');
const router = express.Router();

const booksController = require('../controllers/booksController');

router.post('/add', booksController.addBook);
router.get('/list', booksController.listOfBooks);
router.put('/update/:book_id', booksController.updateBook);
router.delete('/remove/:book_id', booksController.removeBook);

module.exports = router;