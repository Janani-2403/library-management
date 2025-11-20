import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/Reports.css";

export default function Reports() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const booksCollection = collection(db, "books");
  const membersCollection = collection(db, "members");
  const transactionsCollection = collection(db, "transactions");

  useEffect(() => {
    const loadData = async () => {
      const booksSnap = await getDocs(booksCollection);
      const membersSnap = await getDocs(membersCollection);
      const txSnap = await getDocs(transactionsCollection);

      setBooks(booksSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setMembers(membersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setTransactions(txSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    loadData();
  }, []);

  const issued = transactions.filter((t) => !t.returnedAt);
  const overdue = issued.filter((t) => new Date(t.dueAt) < new Date());

  return (
    <div className="reports-page">
      <h1 className="page-title">Reports</h1>

      {/* Inventory */}
      <section className="report-section">
        <h2 className="section-title">Inventory</h2>
        <table className="styled-table">
          <thead>
            <tr><th>Title</th><th>Author</th></tr>
          </thead>
          <tbody>
            {books.length ? (
              books.map((b) => (
                <tr key={b.id}>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="2" className="no-data">No books available</td></tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Issued */}
      <section className="report-section">
        <h2 className="section-title">Issued Books</h2>
        <table className="styled-table">
          <thead>
            <tr><th>Book</th><th>Member</th><th>Issued</th><th>Due</th></tr>
          </thead>
          <tbody>
            {issued.length ? (
              issued.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.bookTitle}</td>
                  <td>{tx.memberName}</td>
                  <td>{new Date(tx.issuedAt).toLocaleDateString()}</td>
                  <td>{new Date(tx.dueAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="no-data">No active issues</td></tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Overdue */}
      <section className="report-section">
        <h2 className="section-title">Overdue Books</h2>
        <table className="styled-table">
          <thead>
            <tr><th>Book</th><th>Member</th><th>Due</th><th>Days Late</th></tr>
          </thead>
          <tbody>
            {overdue.length ? (
              overdue.map((tx) => (
                <tr key={tx.id} className="overdue-row">
                  <td>{tx.bookTitle}</td>
                  <td>{tx.memberName}</td>
                  <td>{new Date(tx.dueAt).toLocaleDateString()}</td>
                  <td>{Math.floor((Date.now() - new Date(tx.dueAt)) / 86400000)}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="no-data">No overdue books 🎉</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
