const express = require('express');
const router = express.Router();

const { verifyJWT } = require('../middlewares/verifyJWT');
const libFunController = require('../controllers/libraryFunController');

router.use(verifyJWT);
router.post('/borrow/:book_id', libFunController.borrowBook);
router.get('/return/:book_id', libFunController.returnBook);
router.get('/reminders', libFunController.returnReminder);

module.exports = router;