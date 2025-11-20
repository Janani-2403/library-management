import React from "react";
import "../styles/MemberCard.css";

export default function MemberCard({ member, onDelete }) {
  return (
    <div className="member-card">
      <div className="member-info">
        <h3 className="member-name">Name: {member.name}</h3>
        <p className="member-details">
          Email: {member.email} <span className="dot"><br />
          </span> Phone: {member.phone}
        </p>
      </div>

      <button
        className="remove-btn"
        onClick={() => onDelete && onDelete(member.id)}
        title="Remove this member"
      >
        Remove
      </button>
    </div>
  );
}
