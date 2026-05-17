const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const User = require("../models/user");
const Book = require("../models/book");

// add book admin
router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res
        .status(400)
        .json({ message: "You are not having access to perform admin work" });
    }
    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });
    await book.save();
    res.status(200).json({ message: "Book added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// add UPDATED admin
router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndUpdate(bookid, {
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });
    res.status(200).json({ message: "Book updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// delete a book
router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndDelete(bookid);
    return res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// get all books
router.get("/get-all-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.json({
      status: "success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get recently added books limit 4
router.get("/get-recent-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);
    return res.json({
      status: "success",
      data: books,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get book by id
router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const books = await Book.findById(id);
    return res.json({
      status: "success",
      data: books,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// SEARCH BOOKS - Full-Text Search Algorithm using Regex
// Algorithm: Case-insensitive regex search across multiple fields (title, author, language)
// Time Complexity: O(n) where n is total books in database
// Search across: title, author, language
router.get("/search-books", async (req, res) => {
  try {
    const { query } = req.query;
    
    // Validate query parameter
    if (!query || query.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Search query is required"
      });
    }

    // Create case-insensitive regex pattern for search
    const searchPattern = new RegExp(query, "i");

    // Search using MongoDB regex across multiple fields
    // Using $or operator to search in title, author, and language fields
    const books = await Book.find({
      $or: [
        { title: searchPattern },
        { author: searchPattern },
        { language: searchPattern },
        { desc: searchPattern }
      ]
    }).sort({ createdAt: -1 });

    // Return results
    return res.json({
      status: "success",
      count: books.length,
      data: books
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
