const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON bodies

const PORT = process.env.PORT || 3000;

// In-memory database for books
let books = [];

// *** Create a New Book (C) ***
app.post('/books', (req, res) => {
    const { book_id, title, author, genre, year, copies } = req.body;

    // Validate input
    if (!book_id || !title || !author || !genre || !year || !copies) {
        return res.status(400).json({ error: 'All book attributes are required!' });
    }

    // Check if the book already exists
    const existingBook = books.find(book => book.book_id === book_id);
    if (existingBook) {
        return res.status(400).json({ error: 'Book with the same ID already exists!' });
    }

    // Add the new book
    const newBook = { book_id, title, author, genre, year, copies };
    books.push(newBook);
    res.status(201).json(newBook);
});

// *** Retrieve All Books (R) ***
app.get('/books', (req, res) => {
    res.json(books);
});

// *** Retrieve a Specific Book by ID (R) ***
app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.book_id === req.params.id);

    if (!book) {
        return res.status(404).json({ error: 'Book not found!' });
    }

    res.json(book);
});

// *** Update Book Information (U) ***
app.put('/books/:id', (req, res) => {
    const book = books.find(b => b.book_id === req.params.id);

    if (!book) {
        return res.status(404).json({ error: 'Book not found!' });
    }

    // Update book details
    const { title, author, genre, year, copies } = req.body;
    if (title) book.title = title;
    if (author) book.author = author;
    if (genre) book.genre = genre;
    if (year) book.year = year;
    if (copies) book.copies = copies;

    res.json(book);
});

// *** Delete a Book (D) ***
app.delete('/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.book_id === req.params.id);

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found!' });
    }

    // Remove the book from the array
    const deletedBook = books.splice(bookIndex, 1);
    res.json({ message: 'Book deleted successfully!', book: deletedBook });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});