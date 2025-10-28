const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Check if username meets basic requirements
    if (!username || username.length < 3) {
        return false;
    }
    // Check if username contains only alphanumeric characters
    const alphanumeric = /^[a-zA-Z0-9]+$/;
    return alphanumeric.test(username);
}

const authenticatedUser = (username, password) => {
    // Check if username and password match the one we have in records
    const user = users.find(user => user.username === username && user.password === password);
    return user !== undefined;
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ 
            message: "Username and password are required" 
        });
    }

    // Authenticate the user
    if (authenticatedUser(username, password)) {
        // Create JWT token
        const accessToken = jwt.sign({ 
            username: username 
        }, 'access', { expiresIn: 60 * 60 });

        // Store authorization in session
        req.session.authorization = {
            accessToken,
            username
        }

        return res.status(200).json({ 
            message: "User successfully logged in",
            accessToken: accessToken
        });
    } else {
        return res.status(401).json({ 
            message: "Invalid Login. Check username and password" 
        });
    }
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;
    const username = req.session.authorization.username;

    // Check if review is provided
    if (!review) {
        return res.status(400).json({ 
            message: "Review text is required" 
        });
    }

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ 
            message: "Book not found with the provided ISBN" 
        });
    }

    // Add or update the review
    books[isbn].reviews[username] = review;

    return res.status(200).json({ 
        message: "Review added/updated successfully",
        book: books[isbn].title,
        isbn: isbn,
        your_review: review
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ 
            message: "Book not found with the provided ISBN" 
        });
    }

    // Check if user has a review for this book
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ 
            message: "No review found for this book by the current user" 
        });
    }

    // Delete the review
    delete books[isbn].reviews[username];

    return res.status(200).json({ 
        message: "Review deleted successfully",
        book: books[isbn].title,
        isbn: isbn
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;