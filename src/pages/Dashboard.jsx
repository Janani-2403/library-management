import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  //  Firestore References
  const booksCollection = collection(db, "books");
  const membersCollection = collection(db, "members");
  const transactionsCollection = collection(db, "transactions");

  //  Load data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      const booksSnap = await getDocs(booksCollection);
      const membersSnap = await getDocs(membersCollection);
      const txSnap = await getDocs(transactionsCollection);

      setBooks(booksSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setMembers(membersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setTransactions(txSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, []);

  //  Stats
  const issued = transactions.filter((t) => !t.returnedAt).length;
  const overdue = transactions.filter(
    (t) => !t.returnedAt && new Date(t.dueAt) < new Date()
  ).length;

  return (
    <div className="container">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="card">
          <div className="small">Total Books</div>
          <h2>{books.length}</h2>
        </div>

        <div className="card">
          <div className="small">Members</div>
          <h2>{members.length}</h2>
        </div>

        <div className="card">
          <div className="small">Currently Issued</div>
          <h2>{issued}</h2>
        </div>

        <div className="card">
          <div className="small">Overdue</div>
          <h2 style={{ color: "var(--danger)" }}>{overdue}</h2>
        </div>
      </div>

      <section style={{ marginTop: 20 }}>
        <h2>Recent Transactions</h2>

        {transactions.length === 0 ? (
          <p style={{ color: "#666", marginTop: 10 }}>No transactions yet.</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Member</th>
                  <th>Issued</th>
                  <th>Due</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {[...transactions]
                  .reverse()
                  .slice(0, 8)
                  .map((tx) => (
                    <tr key={tx.id}>
                      <td>{tx.bookTitle}</td>
                      <td>{tx.memberName}</td>
                      <td>{new Date(tx.issuedAt).toLocaleDateString()}</td>
                      <td>{new Date(tx.dueAt).toLocaleDateString()}</td>
                      <td
                        style={{
                          color: tx.returnedAt ? "green" : "orange",
                          fontWeight: 600,
                        }}
                      >
                        {tx.returnedAt ? "Returned" : "Issued"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
