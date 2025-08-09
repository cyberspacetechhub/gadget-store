const express = require('express');
const router = express.Router();
const { uploadSingle, uploadMultiple } = require('../helpers/imageUpload');
const verifyJWT = require('../middleware/verifyJWT');
const APIResponse = require('../utils/APIResponse');
const catchAsync = require('../utils/catchAsync');

// Upload single image
router.post('/single', verifyJWT, (req, res) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return APIResponse.error(res, err.message, 400);
    }
    
    if (!req.file) {
      return APIResponse.error(res, 'No image file provided', 400);
    }
    
    APIResponse.success(res, { url: req.file.path }, 'Image uploaded successfully');
  });
});

// Upload multiple images
router.post('/multiple', verifyJWT, (req, res) => {
  uploadMultiple(req, res, (err) => {
    if (err) {
      return APIResponse.error(res, err.message, 400);
    }
    
    if (!req.files || req.files.length === 0) {
      return APIResponse.error(res, 'No image files provided', 400);
    }
    
    const urls = req.files.map(file => ({ url: file.path }));
    APIResponse.success(res, { urls }, 'Images uploaded successfully');
  });
});

module.exports = router;