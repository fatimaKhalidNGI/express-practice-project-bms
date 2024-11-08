const express = require('express');
const router = express.Router();

const { verifyJWT } = require('../middlewares/verifyJWT');
const reqUnavailableController = require('../controllers/unavailableBooksController');

router.use(verifyJWT);
router.post('/request', reqUnavailableController.unavailableBookRequest);
router.get('/list', reqUnavailableController.getRequestList);
router.post('/respond/:request_id', reqUnavailableController.respondAdmin);

module.exports = router;