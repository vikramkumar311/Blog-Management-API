const BlogModel = require('../models/BlogModel');
const path = require('path');
const fs = require('fs');

class BlogController {
    // Create a new blog
    static async createBlog(req, res) {
        try {
            const { title, content } = req.body;
            
            // Get image path if file was uploaded
            const imagePath = req.file ? req.file.filename : null;
            
            const blogData = {
                title,
                content,
                image: imagePath
            };

            const newBlog = BlogModel.createBlog(blogData);
            
            if (newBlog) {
                return res.status(201).json({
                    success: true,
                    message: 'Blog created successfully',
                    data: newBlog
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create blog'
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Get all blogs with optional search and pagination
    static async getAllBlogs(req, res) {
        try {
            const { search, page, limit } = req.query;
            
            let blogs;
            
            // Handle search
            if (search) {
                blogs = BlogModel.searchBlogsByTitle(search);
                return res.status(200).json({
                    success: true,
                    message: `Found ${blogs.length} blog(s) matching "${search}"`,
                    data: blogs,
                    searchTerm: search
                });
            }
            
            // Handle pagination
            if (page || limit) {
                const pageNum = parseInt(page) || 1;
                const limitNum = parseInt(limit) || 5;
                const paginatedResult = BlogModel.getPaginatedBlogs(pageNum, limitNum);
                
                return res.status(200).json({
                    success: true,
                    message: 'Blogs retrieved successfully',
                    data: paginatedResult.blogs,
                    pagination: {
                        currentPage: paginatedResult.currentPage,
                        totalPages: paginatedResult.totalPages,
                        totalBlogs: paginatedResult.totalBlogs,
                        hasNextPage: paginatedResult.hasNextPage,
                        hasPrevPage: paginatedResult.hasPrevPage
                    }
                });
            }
            
            // Default: get all blogs
            blogs = BlogModel.getAllBlogs();
            
            return res.status(200).json({
                success: true,
                message: 'All blogs retrieved successfully',
                data: blogs,
                count: blogs.length
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Get single blog by ID
    static async getBlogById(req, res) {
        try {
            const { id } = req.params;
            
            const blog = BlogModel.getBlogById(id);
            
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: `Blog with ID ${id} not found`
                });
            }
            
            return res.status(200).json({
                success: true,
                message: 'Blog retrieved successfully',
                data: blog
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Update blog by ID
    static async updateBlog(req, res) {
        try {
            const { id } = req.params;
            const { title, content } = req.body;
            
            // Check if blog exists
            const existingBlog = BlogModel.getBlogById(id);
            if (!existingBlog) {
                return res.status(404).json({
                    success: false,
                    message: `Blog with ID ${id} not found`
                });
            }
            
            // Prepare update data
            const updateData = {
                title,
                content
            };
            
            // Handle image upload
            if (req.file) {
                updateData.image = req.file.filename;
                
                // Delete old image if it exists
                if (existingBlog.image) {
                    const oldImagePath = path.join(__dirname, '../uploads', existingBlog.image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
            }
            
            const updatedBlog = BlogModel.updateBlog(id, updateData);
            
            if (updatedBlog) {
                return res.status(200).json({
                    success: true,
                    message: 'Blog updated successfully',
                    data: updatedBlog
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update blog'
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Delete blog by ID
    static async deleteBlog(req, res) {
        try {
            const { id } = req.params;
            
            const deletedBlog = BlogModel.deleteBlog(id);
            
            if (!deletedBlog) {
                return res.status(404).json({
                    success: false,
                    message: `Blog with ID ${id} not found`
                });
            }
            
            // Delete associated image file if it exists
            if (deletedBlog.image) {
                const imagePath = path.join(__dirname, '../uploads', deletedBlog.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            
            return res.status(200).json({
                success: true,
                message: 'Blog deleted successfully',
                data: deletedBlog
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

module.exports = BlogController;
