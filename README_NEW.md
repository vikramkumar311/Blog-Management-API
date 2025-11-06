# Blog Management API

A comprehensive Blog Management API built with Node.js and Express, following the MVC architecture. Features include routers, custom middlewares, inbuilt middlewares, and external middleware (multer) for file uploads. Data is stored in a JSON file instead of a database.

## 🚀 Features

- **MVC Architecture**: Clean separation of concerns with Models, Views, and Controllers
- **Custom Middlewares**: Blog validation and request logging
- **Inbuilt Middlewares**: JSON parsing, URL-encoded data, and static file serving
- **External Middleware**: Multer for image upload handling
- **File-based Storage**: Data stored in `db.json` file
- **Image Upload**: Support for blog image uploads with file validation
- **Search Functionality**: Search blogs by title
- **Pagination**: Paginated blog retrieval
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes

## 📁 Project Structure

```
Blog-Management-API/
├── server.js              # Entry point
├── db.json                # Data storage
├── package.json           # Dependencies and scripts
├── models/
│   └── BlogModel.js       # Data access layer
├── controllers/
│   ├── blogController.js  # Blog business logic
│   └── imageController.js # Image serving logic
├── routes/
│   ├── blogRoutes.js      # Blog API routes
│   └── imageRoutes.js     # Image serving routes
├── middlewares/
│   ├── validateBlog.js    # Custom validation middleware
│   ├── requestLogger.js   # Request logging middleware
│   └── multerConfig.js    # File upload configuration
└── uploads/               # Image storage directory
```

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/vikramkumar311/Blog-Management-API.git
cd Blog-Management-API
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
# or for development with nodemon
npm run dev
```

The API will be available at `http://localhost:3000`

## 📚 API Endpoints

### Blog Endpoints

| Method | Endpoint | Description | Body/Query Parameters |
|--------|----------|-------------|----------------------|
| POST | `/blogs/create` | Create a new blog | `title` (required), `content` (required), `image` (file, optional) |
| GET | `/blogs/` | Get all blogs | Query: `search`, `page`, `limit` |
| GET | `/blogs/:id` | Get single blog by ID | URL Parameter: `id` |
| PUT | `/blogs/:id` | Update blog by ID | `title` (required), `content` (required), `image` (file, optional) |
| DELETE | `/blogs/:id` | Delete blog by ID | URL Parameter: `id` |

### Image Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/images/:filename` | Get uploaded image or 404 if not found |

## 📝 Blog Data Structure

Each blog contains the following fields:

```json
{
  "id": 1,
  "title": "Blog Title",
  "content": "Blog content...",
  "image": "image-filename.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🔧 Usage Examples

### Create a Blog

```bash
# With image upload
curl -X POST http://localhost:3000/blogs/create \
  -F "title=My First Blog" \
  -F "content=This is the content of my first blog post." \
  -F "image=@/path/to/image.jpg"

# Without image
curl -X POST http://localhost:3000/blogs/create \
  -H "Content-Type: application/json" \
  -d '{"title":"My Blog","content":"Blog content here"}'
```

### Get All Blogs

```bash
# Get all blogs
curl http://localhost:3000/blogs/

# Search blogs
curl "http://localhost:3000/blogs/?search=first"

# Paginated blogs
curl "http://localhost:3000/blogs/?page=1&limit=5"
```

### Get Single Blog

```bash
curl http://localhost:3000/blogs/1
```

### Update Blog

```bash
curl -X PUT http://localhost:3000/blogs/1 \
  -F "title=Updated Blog Title" \
  -F "content=Updated content" \
  -F "image=@/path/to/new-image.jpg"
```

### Delete Blog

```bash
curl -X DELETE http://localhost:3000/blogs/1
```

### Get Image

```bash
# Access uploaded images directly
curl http://localhost:3000/images/image-filename.jpg
```

## 🛡️ Middleware Details

### Custom Middlewares

1. **validateBlogMiddleware**: Validates that `title` and `content` are present and not empty
2. **requestLogger**: Logs HTTP method, URL, status code, and response time

### Inbuilt Middlewares

1. **express.json()**: Parses JSON request bodies
2. **express.urlencoded()**: Parses URL-encoded request bodies
3. **express.static('uploads')**: Serves static files from uploads directory

### External Middleware

1. **multer**: Handles multipart/form-data for file uploads
   - File size limit: 5MB
   - Only image files allowed
   - Files saved to `uploads/` directory

## 🎯 Bonus Features Implemented

- ✅ **Search blogs by title**: Use `?search=keyword` query parameter
- ✅ **Pagination**: Use `?page=1&limit=5` query parameters
- ✅ **Request logger middleware**: Logs method, URL, and response time

## 🚦 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 🔍 Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid input data or missing required fields
- **404 Not Found**: Blog or image not found
- **500 Internal Server Error**: Server-side errors

## 🏗️ Architecture

The application follows the MVC (Model-View-Controller) pattern:

- **Models**: Handle data operations (reading/writing to db.json)
- **Controllers**: Contain business logic and handle HTTP requests/responses
- **Routes**: Define API endpoints and link them to controllers
- **Middlewares**: Handle cross-cutting concerns like validation, logging, and file uploads

## 📋 Dependencies

- **express**: Web framework for Node.js
- **multer**: Middleware for handling multipart/form-data (file uploads)
- **nodemon**: Development dependency for auto-restarting the server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.
