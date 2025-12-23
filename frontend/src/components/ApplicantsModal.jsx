import { useEffect, useState } from "react";

export default function ApplicantsModal({ opportunityId, token, onClose }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/opportunities/${opportunityId}/applicants`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setApplicants(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [opportunityId, token]);

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Applicants</h3>

        {loading && <p>Loading...</p>}

        {!loading && applicants.length === 0 && (
          <p>No applicants yet</p>
        )}

        {applicants.map(a => (
          <div key={a._id} style={item}>
            <strong>{a.name}</strong>
            <div style={{ fontSize: "0.9rem", color: "#555" }}>
              {a.email}
            </div>
          </div>
        ))}

        <button onClick={onClose} style={closeBtn}>Close</button>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modal = {
  background: "#fff",
  padding: "1.5rem",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "400px",
};

const item = {
  padding: "0.5rem 0",
  borderBottom: "1px solid #eee",
};

const closeBtn = {
  marginTop: "1rem",
  padding: "8px 12px",
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
