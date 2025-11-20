import React from "react";
import "../styles/Books.css";

export default function BookCard({ book, onIssue, onEdit, onDelete }) {
  const coverSrc =
    book.cover?.startsWith("http") || book.cover?.startsWith("/assets/")
      ? book.cover
      : "/assets/default.jpg";

  const isOut = book.available === 0;

  return (
    <div className="book-card">
      <div className="book-cover">
        <img src={coverSrc} alt={book.title} />
      </div>

      <div className="book-info">
        <h3>{book.title}</h3>
        <p>Author: {book.author}</p>
        <p>ISBN: {book.isbn}</p>

        {/*  Show available count with color */}
        <p>
          Available:{" "}
          <span style={{ color: isOut ? "red" : "green", fontWeight: "bold" }}>
            {book.available}
            {isOut && " (Not Available)"}
          </span>
        </p>
      </div>

      <div className="book-actions">
        {/*  Disable Issue Button if no copies */}
        <button className="btn-issue" onClick={onIssue} disabled={isOut}>
          Issue
        </button>

        <button className="btn-edit" onClick={onEdit}>
          Edit
        </button>

        <button className="btn-delete" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
