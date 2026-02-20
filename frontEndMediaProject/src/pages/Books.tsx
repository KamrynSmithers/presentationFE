import { useState, useEffect } from "react";
import { searchBooks, getTrendingBooks, getBookCover } from "../api/books";
import BookDetailsModal from "../components/BookDetailsModal";
import "../books.css";

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  cover_id?: number;
  first_publish_year?: number;
}

function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  /* ⭐ Load favorites */
  useEffect(() => {
    const saved = localStorage.getItem("favoriteBooks");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  /* 🔥 Load trending books */
  useEffect(() => {
    if (!showFavorites) {
      setLoading(true);
      getTrendingBooks()
        .then(setBooks)
        .finally(() => setLoading(false));
    }
  }, [showFavorites]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setShowFavorites(false);

    try {
      const results = await searchBooks(searchQuery);
      setBooks(results);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowFavorites(false);
    setLoading(true);

    getTrendingBooks()
      .then(setBooks)
      .finally(() => setLoading(false));
  };

  const toggleFavorite = (book: Book) => {
    const exists = favorites.some((f) => f.key === book.key);
    const updated = exists
      ? favorites.filter((f) => f.key !== book.key)
      : [...favorites, book];

    setFavorites(updated);
    localStorage.setItem("favoriteBooks", JSON.stringify(updated));
  };

  const displayedBooks = showFavorites ? favorites : books;

  return (
    /* ✅ SCROLL WORKS */
    <div className="books-scroll-container">
      <div className="books-container">
        <h1>Book Explorer</h1>

        {/* 🔍 SEARCH */}
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search for books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
          {searchQuery && (
            <button type="button" onClick={clearSearch}>
              Clear
            </button>
          )}
        </form>

        {/* 🔁 TOGGLE */}
        <div className="view-toggle">
          <button
            className={!showFavorites ? "active" : ""}
            onClick={() => setShowFavorites(false)}
          >
            Trending Books
          </button>
          <button
            className={showFavorites ? "active" : ""}
            onClick={() => setShowFavorites(true)}
          >
            My Favorites ({favorites.length})
          </button>
        </div>

        {/* 📚 CONTENT */}
        {loading ? (
          <div className="loading">Loading books…</div>
        ) : (
          <div className="books-grid">
            {displayedBooks.length === 0 ? (
              <p className="no-books">
                {showFavorites ? "No favorites yet!" : "No books found"}
              </p>
            ) : (
              displayedBooks.map((book) => (
                <div
                  key={book.key}
                  className="book-card"
                  onClick={() => setSelectedBook(book)}
                >
                  <img
                    src={getBookCover(book.cover_i || book.cover_id || 0)}
                    alt={book.title}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/200x300/4bb6b7/ffffff?text=No+Cover";
                    }}
                  />
                  <div className="book-info">
                    <h3>{book.title}</h3>
                    {book.author_name && (
                      <p className="book-author">
                        {book.author_name[0]}
                      </p>
                    )}
                    <span className="book-year">
                      {book.first_publish_year || "N/A"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 📘 MODAL */}
        {selectedBook && (
          <BookDetailsModal
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onAddToFavorites={toggleFavorite}
            isFavorite={favorites.some(
              (f) => f.key === selectedBook.key
            )}
          />
        )}
      </div>
    </div>
  );
}

export default Books;
