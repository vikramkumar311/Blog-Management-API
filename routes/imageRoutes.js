const express = require('express');
const router = express.Router();
const ImageController = require('../controllers/imageController');

// Image Routes

// GET /images/:filename - Check if file exists and serve it, or return 404
router.get('/:filename', ImageController.getImage);

module.exports = router;
