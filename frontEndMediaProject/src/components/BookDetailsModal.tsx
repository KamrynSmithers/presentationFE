import { useEffect, useState } from "react";
import { getBookCover } from "../api/books";
import "../books.css";

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  cover_id?: number;
  first_publish_year?: number;
}

interface Props {
  book: Book;
  onClose: () => void;
  onAddToFavorites: (book: Book) => void;
  isFavorite: boolean;
}

function BookDetailsModal({
  book,
  onClose,
  onAddToFavorites,
  isFavorite,
}: Props) {
  const [description, setDescription] = useState<string>("Loading description…");

  useEffect(() => {
    fetch(`https://openlibrary.org${book.key}.json`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.description === "string") {
          setDescription(data.description);
        } else if (data.description?.value) {
          setDescription(data.description.value);
        } else {
          setDescription("No description available.");
        }
      })
      .catch(() => {
        setDescription("No description available.");
      });
  }, [book.key]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="book-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/*  CLOSE */}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <img
          className="modal-cover"
          src={getBookCover(book.cover_i || book.cover_id || 0)}
          alt={book.title}
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/200x300/4bb6b7/ffffff?text=No+Cover";
          }}
        />

        <div className="modal-info">
          <h2>{book.title}</h2>

          {book.author_name && (
            <p className="modal-author">
              {book.author_name.join(", ")}
            </p>
          )}

          <p className="modal-year">
            First published: {book.first_publish_year || "N/A"}
          </p>

          <p className="modal-description">{description}</p>

          <button
            className="favorite-btn"
            onClick={() => onAddToFavorites(book)}
          >
            {isFavorite ? "★ Remove Favorite" : "☆ Add to Favorites"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookDetailsModal;
