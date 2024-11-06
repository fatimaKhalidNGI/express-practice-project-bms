const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.get('/list', userController.usersList);
router.delete('/remove/:user_id', userController.removeUser);

module.exports = router;