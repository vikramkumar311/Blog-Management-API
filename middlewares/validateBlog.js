// Custom middleware to validate blog data
const validateBlogMiddleware = (req, res, next) => {
    const { title, content } = req.body;
    
    // Check if required fields are present
    if (!title || !content) {
        return res.status(400).json({
            success: false,
            message: 'Bad Request: title and content are required fields',
            missingFields: {
                title: !title ? 'Title is required' : null,
                content: !content ? 'Content is required' : null
            }
        });
    }

    // Check if fields are not empty strings
    if (title.trim() === '' || content.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Bad Request: title and content cannot be empty'
        });
    }

    // If validation passes, continue to next middleware/controller
    next();
};

module.exports = validateBlogMiddleware;
