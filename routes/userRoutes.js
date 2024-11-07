const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { verifyJWT } = require('../middlewares/verifyJWT');

router.post('/register', userController.registerUser);
router.post('/login', userController.userLogin);
router.get('/logout', userController.userLogout);
router.get('/refresh', userController.refreshJWT);

router.use(verifyJWT);
router.get('/list', userController.usersList);
router.put('/update/:user_id', userController.updateUserInfo);
router.delete('/remove/:user_id', userController.removeUser);

module.exports = router;