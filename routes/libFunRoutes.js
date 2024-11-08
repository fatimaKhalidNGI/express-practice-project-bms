const express = require('express');
const router = express.Router();

const { verifyJWT } = require('../middlewares/verifyJWT');
const libFunController = require('../controllers/libraryFunController');

router.use(verifyJWT);
router.get('/borrow/:book_id', libFunController.borrowBook);
router.get('/return/:book_id', libFunController.returnBook);

module.exports = router;