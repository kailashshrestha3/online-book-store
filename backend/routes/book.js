const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const User = require("../models/user");
const Book = require("../models/book");
const levenshtein = require("fast-levenshtein");

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

// SEARCH BOOKS - Fuzzy Search Algorithm using Levenshtein Distance
// Algorithm: Fuzzy string matching with typo tolerance
// Time Complexity: O(n * m^2) where n is total books and m is average string length
// Features: Typo tolerance up to 5 character distance threshold
// Searches across: title, author, language fields
router.get("/search-books", async (req, res) => {
  try {
    const { query } = req.query;

    // Validate query
    if (!query || query.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Search query is required",
      });
    }

    // Clean query
    const searchQuery = query.trim().toLowerCase();

    // Get all books
    const books = await Book.find();

    // Maximum typo distance allowed
    const threshold = 5;

    // Fuzzy search logic using Levenshtein distance
    const matchedBooks = books
      .map((book) => {
        // Calculate distances
        const titleDistance = levenshtein.get(
          searchQuery,
          book.title.toLowerCase(),
        );

        const authorDistance = levenshtein.get(
          searchQuery,
          book.author.toLowerCase(),
        );

        const languageDistance = levenshtein.get(
          searchQuery,
          book.language.toLowerCase(),
        );

        // Find smallest distance
        const minDistance = Math.min(
          titleDistance,
          authorDistance,
          languageDistance,
        );

        return {
          ...book._doc,
          distance: minDistance,
        };
      })

      // Allow typo tolerance
      .filter((book) => book.distance <= threshold)

      // Sort closest matches first
      .sort((a, b) => a.distance - b.distance);

    // Response
    return res.json({
      status: "success",
      count: matchedBooks.length,
      data: matchedBooks,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

module.exports = router;

router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.headers.id);
    if (user.role !== "admin") return console.log("Access denied");

    const book = new Book(req.body);
    await book.save();
    return console.log("Book added successfully");
  } catch (error) {
    return console.log(error);
  }
});
router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.headers.id);
    if (user.role !== "admin") return console.log("Access denied");

    await Book.findByIdAndUpdate(req.headers.bookid, req.body);
    return console.log("Book updated successfully");
  } catch (error) {
    return console.log(error);
  }
});
router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.headers.id);
    if (user.role !== "admin") return console.log("Access denied");

    await Book.findByIdAndDelete(req.headers.bookid);
    return console.log("Book deleted successfully");
  } catch (error) {
    return console.log(error);
  }
});
