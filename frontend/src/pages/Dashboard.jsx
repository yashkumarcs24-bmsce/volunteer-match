import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/opportunities")
      .then((res) => setOpportunities(res.data))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const apply = async (id) => {
    await axios.post("http://localhost:8000/api/applications", {
      opportunityId: id,
      volunteerId: user.id,
      volunteerName: user.name,
      volunteerEmail: user.email,
    });
    alert("Applied successfully");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1>Dashboard</h1>
        <p style={styles.welcome}>
          Welcome, <b>{user?.name}</b> · {user?.role}
        </p>

        <div style={styles.actions}>
          <button style={styles.logout} onClick={handleLogout}>
            Logout
          </button>

          {user?.role === "org" && (
            <button
              style={styles.primary}
              onClick={() => navigate("/applicants")}
            >
              View Applicants
            </button>
          )}
        </div>

        <hr />

        {opportunities.map((op) => (
          <div key={op._id} style={styles.card}>
            <h3>{op.title}</h3>
            <p>{op.description}</p>
            <p style={styles.deadline}>Deadline: {op.deadline}</p>

            {user?.role === "volunteer" && (
              <button
                style={styles.apply}
                onClick={() => apply(op._id)}
              >
                Apply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e6fff4, #eef5ff)",
    display: "flex",
    justifyContent: "center",
    paddingTop: "3rem",
  },
  container: {
    width: "100%",
    maxWidth: "720px",
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  welcome: {
    color: "#555",
    marginBottom: "1rem",
  },
  actions: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1rem",
  },
  logout: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
  },
  primary: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
  },
  card: {
    border: "1px solid #eee",
    borderRadius: "10px",
    padding: "1rem",
    marginTop: "1rem",
    transition: "transform 0.2s",
  },
  deadline: {
    fontSize: "0.9rem",
    color: "#555",
  },
  apply: {
    marginTop: "0.5rem",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
































































