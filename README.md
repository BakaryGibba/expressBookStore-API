# Bookstore API Documentation

## 📋 Project Overview
A RESTful API for a bookstore management system with user authentication, book catalog, and review functionality.

## 🏗️ Project Structure
```
final_project/
├── server.js (or index.js)          # Main server file
├── booksdb.js                       # Books database
├── router/
│   ├── general.js                   # Public routes
│   └── auth_users.js                # Authenticated routes
└── README.md                        # This documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js
- npm

### Installation
```bash
# Install dependencies
npm install express jsonwebtoken express-session

# Start the server
node index.js
```
Server runs on: `http://localhost:5000`

## 📚 API Endpoints

### Public Routes (No Authentication Required)

#### 1. Get All Books
**GET** `/`
```bash
curl -X GET http://localhost:5000/
```

#### 2. Get Book by ISBN
**GET** `/isbn/:isbn`
```bash
curl -X GET http://localhost:5000/isbn/1
```

#### 3. Get Books by Author
**GET** `/author/:author`
```bash
curl -X GET "http://localhost:5000/author/Jane"
```

#### 4. Get Books by Title
**GET** `/title/:title`
```bash
curl -X GET "http://localhost:5000/title/Things"
```

#### 5. Get Book Reviews
**GET** `/review/:isbn`
```bash
curl -X GET http://localhost:5000/review/1
```

#### 6. Register User
**POST** `/register`
```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"password123"}'
```

### Authenticated Routes (Require Login)

#### 7. User Login
**POST** `/customer/login`
```bash
curl -X POST http://localhost:5000/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"password123"}'
```

#### 8. Add/Update Review
**PUT** `/customer/auth/review/:isbn`
```bash
curl -X PUT http://localhost:5000/customer/auth/review/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"review":"Excellent book!"}'
```

#### 9. Delete Review
**DELETE** `/customer/auth/review/:isbn`
```bash
curl -X DELETE http://localhost:5000/customer/auth/review/1 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

## 🔐 Authentication System

### JWT Token Flow
1. **Register** → Create user account
2. **Login** → Receive JWT token
3. **Use Token** → Include in `Authorization: Bearer <token>` header

### Session Management
- Uses Express Session for state management
- JWT tokens expire in 1 hour
- Automatic session cleanup on logout

## 💾 Data Models

### Book Structure
```javascript
{
  "1": {
    "author": "Chinua Achebe",
    "title": "Things Fall Apart",
    "reviews": {
      "username1": "Great book!",
      "username2": "Excellent read"
    }
  }
}
```

### User Structure
```javascript
{
  "username": "john",
  "password": "password123"
}
```

## 🧪 Testing Guide

### Using PowerShell (Windows)
```powershell
# Test all endpoints
.\test.ps1

# Or test individually:
Invoke-RestMethod -Uri "http://localhost:5000/" -Method Get
```

### Sample Test Script (`test.ps1`)
```powershell
Write-Host "=== Bookstore API Testing ===" -ForegroundColor Green

# Test public endpoints
Invoke-RestMethod -Uri "http://localhost:5000/" -Method Get
Invoke-RestMethod -Uri "http://localhost:5000/isbn/1" -Method Get

# Register and login
Invoke-RestMethod -Uri "http://localhost:5000/register" -Method Post -Body '{"username":"test","password":"test"}' -ContentType "application/json"
$login = Invoke-RestMethod -Uri "http://localhost:5000/customer/login" -Method Post -Body '{"username":"test","password":"test"}' -ContentType "application/json"

# Test authenticated endpoints
$headers = @{"Authorization" = "Bearer $($login.accessToken)"; "Content-Type" = "application/json"}
Invoke-RestMethod -Uri "http://localhost:5000/customer/auth/review/1" -Method Put -Headers $headers -Body '{"review":"Test review"}'
Invoke-RestMethod -Uri "http://localhost:5000/customer/auth/review/1" -Method Delete -Headers $headers
```

## 📋 Assignment Tasks Checklist

### Required Screenshots:
- [ ] `1-getallbooks.png` - Get all books
- [ ] `2-getdetailsISBN.png` - Get book by ISBN
- [ ] `3-getbooksbyauthor.png` - Get books by author
- [ ] `4-getbooksbytitle.png` - Get books by title
- [ ] `5-getbookreview.png` - Get book reviews
- [ ] `6-register.png` - User registration
- [ ] `7-login.png` - User login
- [ ] `8-reviewadded.png` - Add review
- [ ] `9-deletereview.png` - Delete review

## 🔧 Error Handling

### Common HTTP Status Codes
- `200` - Success
- `400` - Bad Request (missing parameters)
- `401` - Unauthorized (invalid credentials)
- `403` - Forbidden (invalid token)
- `404` - Not Found (book not found)
- `409` - Conflict (username exists)
- `500` - Internal Server Error

### Sample Error Responses
```json
{
  "message": "Username already exists",
  "code": "USER_EXISTS"
}
```

## 🛡️ Security Features

- Password hashing (recommended for production)
- JWT token expiration
- Session management
- Input validation
- CORS protection (can be added)

## 📦 Dependencies

```json
{
  "express": "^4.18.0",
  "jsonwebtoken": "^9.0.0",
  "express-session": "^1.17.0"
}
```

## 🚀 Deployment Notes

### Environment Variables (Recommended for Production)
```javascript
// In production, use environment variables:
const JWT_SECRET = process.env.JWT_SECRET || 'access';
const SESSION_SECRET = process.env.SESSION_SECRET || 'fingerprint_customer';
```

### Production Considerations
- Use HTTPS
- Implement rate limiting
- Add input sanitization
- Use environment variables for secrets
- Implement proper logging
- Add database persistence

## ❓ Troubleshooting

### Common Issues
1. **Port already in use**: Change port in `server.js`
2. **Module not found**: Run `npm install`
3. **Authentication failed**: Check username/password
4. **Token invalid**: Re-login to get new token

### Debug Mode
Add debug logging to see request flow:
```javascript
// Add to your routes
console.log('Request received:', req.method, req.url);
```

## 👥 Contributing

1. Fork the repository
2. Create feature branch
3. Test all endpoints
4. Submit pull request

## 📄 License

This project is for educational purposes as part of the IBM Full Stack Software Developer Professional Certificate.

---

**Note**: This is a learning project. For production use, implement additional security measures like password hashing, input validation, and database persistence.

