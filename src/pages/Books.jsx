import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";
import "../styles/Books.css";

import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    cover: "",
  });

  const nav = useNavigate();
  const booksCollection = collection(db, "books");
  const membersCollection = collection(db, "members");

  // REAL-TIME LOAD BOOKS (No refresh needed)
  useEffect(() => {
    const unsubscribe = onSnapshot(booksCollection, (snapshot) => {
      setBooks(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.title || !form.author || !form.isbn) {
      return alert("⚠️ Please fill all fields!");
    }

    const bookData = {
      title: form.title.trim(),
      author: form.author.trim(),
      isbn: form.isbn.trim(),
      cover: form.cover.trim() || "/assets/default.jpg",
      total: 1,
      available: 1,
    };

    if (editingId) {
      await updateDoc(doc(db, "books", editingId), bookData);
      setEditingId(null);
    } else {
      await addDoc(booksCollection, bookData);
    }

    setForm({ title: "", author: "", isbn: "", cover: "" });
  };

  const handleEdit = (book) => {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      cover: book.cover,
    });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "books", id));
  };

  const handleIssue = async (id) => {
    const unsub = onSnapshot(membersCollection, (snapshot) => {
      const members = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (members.length === 0) {
        alert("⚠️ No members found. Add a member first.");
      } else {
        localStorage.setItem("selectedBookId", id);
        nav("/issue");
      }
    });
    setTimeout(unsub, 500);
  };

  return (
    <div className="books-page">
      <h2>📚 Books</h2>

      <div className="add-book-form">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} />
        <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} />
        <input name="cover" placeholder="Cover URL (optional)" value={form.cover} onChange={handleChange} />

        <button onClick={handleSave}>
          {editingId ? "Save Changes" : "Add Book"}
        </button>
      </div>

      <div className="book-list">
        {books.length === 0 ? (
          <p className="empty">No books yet. Add one above!</p>
        ) : (
          books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onIssue={() => handleIssue(book.id)}
              onEdit={() => handleEdit(book)}
              onDelete={() => handleDelete(book.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
