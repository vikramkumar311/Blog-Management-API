const path = require('path');
const fs = require('fs');

class ImageController {
    // Serve image file or return 404 if not found
    static async getImage(req, res) {
        try {
            const { filename } = req.params;
            
            // Construct the full path to the image
            const imagePath = path.join(__dirname, '../uploads', filename);
            
            // Check if file exists
            if (!fs.existsSync(imagePath)) {
                return res.status(404).json({
                    success: false,
                    message: 'Image not found'
                });
            }
            
            // Get file stats to check if it's actually a file
            const stats = fs.statSync(imagePath);
            if (!stats.isFile()) {
                return res.status(404).json({
                    success: false,
                    message: 'Image not found'
                });
            }
            
            // Get file extension to set proper content type
            const fileExtension = path.extname(filename).toLowerCase();
            let contentType = 'image/jpeg'; // default
            
            switch (fileExtension) {
                case '.png':
                    contentType = 'image/png';
                    break;
                case '.gif':
                    contentType = 'image/gif';
                    break;
                case '.webp':
                    contentType = 'image/webp';
                    break;
                case '.svg':
                    contentType = 'image/svg+xml';
                    break;
                case '.jpg':
                case '.jpeg':
                    contentType = 'image/jpeg';
                    break;
                default:
                    contentType = 'image/jpeg';
            }
            
            // Set proper headers
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
            
            // Send the file
            return res.sendFile(imagePath);
            
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

module.exports = ImageController;
