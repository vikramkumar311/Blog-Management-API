const express = require('express');
const path = require('path');
const multer = require('multer');
const requestLogger = require('./middlewares/requestLogger');
const blogRoutes = require('./routes/blogRoutes');
const imageRoutes = require('./routes/imageRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares

// 1. Custom Middleware - Request Logger (logs method, URL, and response time)
app.use(requestLogger);

// 2. Inbuilt Middlewares
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.static('uploads')); // Serve uploaded blog images directly from uploads folder

// Routes

// Blog routes
app.use('/blogs', blogRoutes);

// Image routes
app.use('/images', imageRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Blog Management API is running!',
        version: '1.0.0',
        endpoints: {
            blogs: {
                'POST /blogs/create': 'Create a new blog (with optional image upload)',
                'GET /blogs/': 'Get all blogs (supports ?search=term&page=1&limit=5)',
                'GET /blogs/:id': 'Get a single blog by ID',
                'PUT /blogs/:id': 'Update a blog by ID',
                'DELETE /blogs/:id': 'Delete a blog by ID'
            },
            images: {
                'GET /images/:filename': 'Get uploaded image or 404 if not found'
            }
        },
        features: [
            'MVC Architecture',
            'Custom Middlewares (validation, request logging)',
            'Inbuilt Middlewares (json, urlencoded, static)',
            'External Middleware (multer for file uploads)',
            'Search blogs by title',
            'Pagination support',
            'Image upload and serving',
            'JSON file-based storage'
        ]
    });
});

// Handle 404 for undefined routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        availableRoutes: [
            'GET /',
            'POST /blogs/create',
            'GET /blogs/',
            'GET /blogs/:id',
            'PUT /blogs/:id',
            'DELETE /blogs/:id',
            'GET /images/:filename'
        ]
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global Error Handler:', error);
    
    // Multer errors
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 5MB.'
            });
        }
    }
    
    // Custom file filter errors
    if (error.message === 'Only image files are allowed!') {
        return res.status(400).json({
            success: false,
            message: 'Only image files are allowed!'
        });
    }
    
    // Generic error response
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Blog Management API is running on port ${PORT}`);
    console.log(`📖 API Documentation: http://localhost:${PORT}/`);
    console.log(`🔗 Base URL: http://localhost:${PORT}`);
    console.log('\n📋 Available Endpoints:');
    console.log('   • POST   /blogs/create     - Create new blog');
    console.log('   • GET    /blogs/           - Get all blogs');
    console.log('   • GET    /blogs/:id        - Get blog by ID');
    console.log('   • PUT    /blogs/:id        - Update blog');
    console.log('   • DELETE /blogs/:id        - Delete blog');
    console.log('   • GET    /images/:filename - Get uploaded image');
    console.log('\n✨ Features: MVC Architecture, Middlewares, File Upload, Search, Pagination');
});

module.exports = app;
