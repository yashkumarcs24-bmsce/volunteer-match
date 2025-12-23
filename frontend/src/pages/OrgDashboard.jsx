import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function OrgDashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Organization Dashboard</h1>
      <p>Welcome, {user.name}</p>

      <button onClick={logout}>Logout</button>

      <hr />

      <Link to="/create">
        <button>Create Opportunity</button>
      </Link>
    </div>
  );
}

export default OrgDashboard;

