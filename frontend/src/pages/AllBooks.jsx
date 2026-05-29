import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Fuse from "fuse.js";
import BookCard from "../components/BookCard/BookCard";
import Loader from "../components/Loader/Loader";
import { FaSearch } from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AllBooks = () => {
  const [data, setData] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState();
  const [isSearching, setIsSearching] = useState(false);
  const [fuseInstance, setFuseInstance] = useState(null);

  // Fetch all books on component mount
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(`${BACKEND_URL}/get-all-books`);
      setData(response.data.data);
      setFilteredData(response.data.data);

      // Initialize Fuse.js with fuzzy search options
      const fuse = new Fuse(response.data.data, {
        keys: ["title", "author", "language", "desc"],
        threshold: 0.3, // 0.3 = 70% match required (lower = stricter)
        minMatchCharLength: 2,
        includeScore: true,
        useExtendedSearch: true,
      });
      setFuseInstance(fuse);
    };
    fetch();
  }, []);

  // Handle fuzzy search - called when user types in search box
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // If search query is empty, show all books
    if (query.trim() === "") {
      setFilteredData(data);
      setIsSearching(false);
      return;
    }

    // Set loading state
    setIsSearching(true);

    try {
      if (fuseInstance) {
        // Perform fuzzy search using Fuse.js
        const results = fuseInstance.search(query);

        // Extract just the book data from results (remove score metadata)
        const fuzzyResults = results.map((result) => result.item);

        setFilteredData(fuzzyResults);
      }
    } catch (error) {
      console.error("Fuzzy search error:", error);
      setFilteredData([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-zinc-900 h-auto px-12 py-8">
      <div className="flex flex-col gap-4">
        <h4 className="text-3xl text-yellow-100">All Books</h4>

        {/* Fuzzy Search Input */}
        <div className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg w-full md:w-96">
          <FaSearch className="text-blue-500" />
          <input
            type="text"
            placeholder="Search books (supports typos!)..."
            value={searchQuery}
            onChange={handleSearch}
            className="bg-zinc-800 text-white outline-none w-full"
          />
        </div>

        {/* Search Results Count & Type */}
        {searchQuery && (
          <p className="text-zinc-400 text-sm">
            {isSearching
              ? "Searching with fuzzy match..."
              : `Found ${filteredData?.length || 0} result(s) - Fuzzy Search`}
          </p>
        )}
      </div>

      {/* Loading State */}
      {!data && (
        <div className="w-full h-screen flex items-center justify-center">
          <Loader />
        </div>
      )}

      {/* Books Grid */}
      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredData && filteredData.length > 0
          ? filteredData.map((item, index) => (
              <div key={index}>
                <BookCard data={item} />
              </div>
            ))
          : data && (
              <div className="col-span-full text-center py-12 text-zinc-400">
                <p className="text-lg">
                  No books found matching "{searchQuery}"
                </p>
                <p className="text-sm mt-2">
                  Try searching with different keywords
                </p>
              </div>
            )}
      </div>
    </div>
  );
};

export default AllBooks;

// // 1. Initialization of Fuzzy Search Logic
// const fuse = new Fuse(response.data.data, {
//   keys: ["title", "author", "language", "desc"], // Fields to search
//   threshold: 0.3, // Levenshtein threshold: 0.3 = approx. 70% match required
//   minMatchCharLength: 2,
//   includeScore: true,
// });
// setFuseInstance(fuse);

// // 2. Execution of Fuzzy Match
// const handleSearch = (e) => {
//   const query = e.target.value;
//   if (fuseInstance && query.trim() !== "") {
//     // Perform fuzzy search using Levenshtein distance
//     const results = fuseInstance.search(query);

//     // Map results to extract book items
//     const fuzzyResults = results.map((result) => result.item);
//     setFilteredData(fuzzyResults);
//   }
// };
