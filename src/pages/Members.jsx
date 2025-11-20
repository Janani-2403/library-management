import React, { useState, useEffect } from "react";
import MemberCard from "../components/MemberCard";
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/Members.css";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const membersCollection = collection(db, "members");

  // REAL-TIME LOAD MEMBERS
  useEffect(() => {
    const unsubscribe = onSnapshot(membersCollection, (snapshot) => {
      setMembers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
       setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

     const { name, email, phone } = form;

    
    if (!name || !email || !phone) {
      alert("⚠️ Please fill all fields");
      return;
    }

    await addDoc(membersCollection, form);
    setForm({ name: "", email: "", phone: "" });
  };

   //  REMOVE MEMBER
  const removeMember = async (id) => {
    if (window.confirm("Delete this member?")) {
      await deleteDoc(doc(db, "members", id));
    }
  };

  //  SEARCH FILTER
  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(q.toLowerCase()) ||
      m.email.toLowerCase().includes(q.toLowerCase()) ||
      m.phone.includes(q)
  );

  return (
    <div className="members-page">
      <h1 className="page-title">👥 Members</h1>

      <form className="member-form" onSubmit={submit}>
        <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/>
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/>
        <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}/>
        <button type="submit" className="btn-add">➕ Add Member</button>
      </form>

      <div className="member-search">
        <input placeholder="🔍 Search members" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

       {/*  MEMBERS LIST */}
      <div className="member-list">
        {loading ? (
          <div className="loading">Loading members...</div>
        ) : filtered.length > 0 ? (
          filtered.map((m) => (
            <MemberCard key={m.id} member={m} onDelete={removeMember} />
          ))
        ) : (
          <div className="no-members">No members found.</div>
        )}
      </div>
    </div>
  );
}
