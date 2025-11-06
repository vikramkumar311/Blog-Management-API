const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../db.json');

class BlogModel {
    // Read data from db.json
    static readData() {
        try {
            const data = fs.readFileSync(DB_PATH, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading db.json:', error);
            return { blogs: [] };
        }
    }

    // Write data to db.json
    static writeData(data) {
        try {
            fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error('Error writing to db.json:', error);
            return false;
        }
    }

    // Get all blogs
    static getAllBlogs() {
        const data = this.readData();
        return data.blogs;
    }

    // Get blog by ID
    static getBlogById(id) {
        const data = this.readData();
        return data.blogs.find(blog => blog.id === parseInt(id));
    }

    // Create new blog
    static createBlog(blogData) {
        const data = this.readData();
        
        // Generate new ID
        const newId = data.blogs.length > 0 ? Math.max(...data.blogs.map(blog => blog.id)) + 1 : 1;
        
        const newBlog = {
            id: newId,
            title: blogData.title,
            content: blogData.content,
            image: blogData.image || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        data.blogs.push(newBlog);
        
        if (this.writeData(data)) {
            return newBlog;
        }
        return null;
    }

    // Update blog
    static updateBlog(id, updateData) {
        const data = this.readData();
        const blogIndex = data.blogs.findIndex(blog => blog.id === parseInt(id));
        
        if (blogIndex === -1) {
            return null;
        }

        // Update blog data
        data.blogs[blogIndex] = {
            ...data.blogs[blogIndex],
            title: updateData.title || data.blogs[blogIndex].title,
            content: updateData.content || data.blogs[blogIndex].content,
            image: updateData.image !== undefined ? updateData.image : data.blogs[blogIndex].image,
            updatedAt: new Date().toISOString()
        };

        if (this.writeData(data)) {
            return data.blogs[blogIndex];
        }
        return null;
    }

    // Delete blog
    static deleteBlog(id) {
        const data = this.readData();
        const blogIndex = data.blogs.findIndex(blog => blog.id === parseInt(id));
        
        if (blogIndex === -1) {
            return false;
        }

        const deletedBlog = data.blogs[blogIndex];
        data.blogs.splice(blogIndex, 1);
        
        if (this.writeData(data)) {
            return deletedBlog;
        }
        return false;
    }

    // Search blogs by title
    static searchBlogsByTitle(searchTerm) {
        const data = this.readData();
        return data.blogs.filter(blog => 
            blog.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Get paginated blogs
    static getPaginatedBlogs(page = 1, limit = 5) {
        const data = this.readData();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        return {
            blogs: data.blogs.slice(startIndex, endIndex),
            totalBlogs: data.blogs.length,
            currentPage: parseInt(page),
            totalPages: Math.ceil(data.blogs.length / limit),
            hasNextPage: endIndex < data.blogs.length,
            hasPrevPage: page > 1
        };
    }
}

module.exports = BlogModel;
