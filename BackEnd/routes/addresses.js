const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const verifyJWT = require('../middleware/verifyJWT');

// All routes require authentication
router.use(verifyJWT);

router.get('/', addressController.getUserAddresses);
router.get('/default', addressController.getDefaultAddress);
router.get('/:id', addressController.getAddressById);
router.post('/', addressController.createAddress);
router.put('/:id', addressController.updateAddress);
router.patch('/:id/default', addressController.setDefaultAddress);
router.delete('/:id', addressController.deleteAddress);

module.exports = router;