import React, { useState, useEffect } from "react";
import "../styles/IssueReturn.css";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function IssueReturn() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");

  useEffect(() => {
    const unsubBooks = onSnapshot(collection(db, "books"), (snap) =>
      setBooks(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const unsubMembers = onSnapshot(collection(db, "members"), (snap) =>
      setMembers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const unsubTx = onSnapshot(collection(db, "transactions"), (snap) =>
      setTransactions(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    return () => {
      unsubBooks();
      unsubMembers();
      unsubTx();
    };
  }, []);

  const issueBook = async () => {
    if (!bookId || !memberId) return alert("⚠️ Select book & member.");

    const book = books.find((b) => b.id === bookId);
    const member = members.find((m) => m.id === memberId);

    if (book.available <= 0) return alert("❌ Book not available");

    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(issueDate.getDate() + 7);

    await addDoc(collection(db, "transactions"), {
      bookId,
      bookTitle: book.title,
      memberId,
      memberName: member.name,
      issuedAt: issueDate.toISOString(),
      dueAt: dueDate.toISOString(),
      returnedAt: null,
    });

    await updateDoc(doc(db, "books", bookId), {
      available: book.available - 1,
    });

    setBookId("");
    setMemberId("");
  };

  const handleReturn = async (tx) => {
    const book = books.find((b) => b.id === tx.bookId);

    await updateDoc(doc(db, "transactions", tx.id), {
      returnedAt: new Date().toISOString(),
    });

    await updateDoc(doc(db, "books", tx.bookId), {
      available: book.available + 1,
    });
  };

  return (
    <div className="issue-page">
      <h1>📖 Issue / Return</h1>

      <form className="issue-form" onSubmit={(e) => { e.preventDefault(); issueBook(); }}>
        <select value={bookId} onChange={(e) => setBookId(e.target.value)}>
          <option value="">Select Book</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title} ({b.available} available)
            </option>
          ))}
        </select>

        <select value={memberId} onChange={(e) => setMemberId(e.target.value)}>
          <option value="">Select Member</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        <button type="submit" className="btn-issue">Issue Book</button>
      </form>

      {/* Active Issues */}
      <section className="issue-section">
  <h2>📚 Active Issues</h2>
  <div className="table-container">
    <table className="table">
      <thead>
        <tr>
          <th>Book</th>
          <th>Member</th>
          <th>Issued</th>
          <th>Due</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {transactions.filter((t) => !t.returnedAt).length > 0 ? (
          transactions.filter((t) => !t.returnedAt).map((tx) => (
            <tr key={tx.id}>
              <td>{tx.bookTitle}</td>
              <td>{tx.memberName}</td>
              <td>{new Date(tx.issuedAt).toLocaleDateString()}</td>
              <td>{new Date(tx.dueAt).toLocaleDateString()}</td>
              <td>
                <button className="btn-return" onClick={() => handleReturn(tx)}>
                  Return
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="no-data">No active issues</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</section>

      {/* Returned Books */}
      <section className="return-section">
        <h2>✅ Returned Books</h2>
        <div className="table-container">  
                <table className="table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Member</th>
              <th>Issued</th>
              <th>Returned</th>
            </tr>
          </thead>
          <tbody>
            {transactions.filter((t) => t.returnedAt).map((tx) => (
              <tr key={tx.id}>
                <td>{tx.bookTitle}</td>
                <td>{tx.memberName}</td>
                <td>{new Date(tx.issuedAt).toLocaleDateString()}</td>
                <td>{new Date(tx.returnedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>
    </div>
  );
}
