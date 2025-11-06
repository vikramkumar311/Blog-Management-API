const express = require('express');
const router = express.Router();
const BlogController = require('../controllers/blogController');
const validateBlogMiddleware = require('../middlewares/validateBlog');
const upload = require('../middlewares/multerConfig');

// Blog Routes

// POST /blogs/create - Create a new blog (with optional image upload)
router.post('/create', upload.single('image'), validateBlogMiddleware, BlogController.createBlog);

// GET /blogs/ - Get all blogs (supports search and pagination)
router.get('/', BlogController.getAllBlogs);

// GET /blogs/:id - Get a single blog by ID
router.get('/:id', BlogController.getBlogById);

// PUT /blogs/:id - Update a blog by ID
router.put('/:id', upload.single('image'), validateBlogMiddleware, BlogController.updateBlog);

// DELETE /blogs/:id - Delete a blog by ID
router.delete('/:id', BlogController.deleteBlog);

module.exports = router;
