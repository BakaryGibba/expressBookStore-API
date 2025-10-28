const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    // Check if username is valid
    if (!isValid(username)) {
        return res.status(400).json({
            message: "Username must be at least 3 characters long and contain only alphanumeric characters"
        });
    }

    // Check if username already exists
    if (users.find(user => user.username === username)) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }

    // Register the new user
    users.push({ username, password });
    return res.status(201).json({
        message: "User registered successfully"
    });
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
    const booksList = JSON.stringify(books, null, 2);
    return res.status(200).json({
        message: "List of all books",
        books: books
    });
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    // Check if book exists with the given ISBN
    if (books[isbn]) {
        return res.status(200).json({
            message: "Book found",
            book: books[isbn]
        });
    } else {
        return res.status(404).json({
            message: "Book not found with the provided ISBN"
        });
    }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const matchingBooks = [];

    // Get all ISBNs (keys) from the books object
    const isbns = Object.keys(books);
    
    // Iterate through all books and check for matching author
    for (let isbn of isbns) {
        if (books[isbn].author.toLowerCase().includes(author.toLowerCase())) {
            matchingBooks.push({
                isbn: isbn,
                ...books[isbn]
            });
        }
    }

    if (matchingBooks.length > 0) {
        return res.status(200).json({
            message: `Found ${matchingBooks.length} book(s) by author '${author}'`,
            books: matchingBooks
        });
    } else {
        return res.status(404).json({
            message: `No books found by author '${author}'`
        });
    }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const matchingBooks = [];

    // Get all ISBNs (keys) from the books object
    const isbns = Object.keys(books);
    
    // Iterate through all books and check for matching title
    for (let isbn of isbns) {
        if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
            matchingBooks.push({
                isbn: isbn,
                ...books[isbn]
            });
        }
    }

    if (matchingBooks.length > 0) {
        return res.status(200).json({
            message: `Found ${matchingBooks.length} book(s) with title containing '${title}'`,
            books: matchingBooks
        });
    } else {
        return res.status(404).json({
            message: `No books found with title containing '${title}'`
        });
    }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    // Check if book exists with the given ISBN
    if (books[isbn]) {
        return res.status(200).json({
            message: "Reviews found",
            isbn: isbn,
            title: books[isbn].title,
            reviews: books[isbn].reviews
        });
    } else {
        return res.status(404).json({
            message: "Book not found with the provided ISBN"
        });
    }
});

module.exports.general = public_users;