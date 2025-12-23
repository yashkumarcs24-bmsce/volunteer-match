import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("volunteer");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    navigate("/login");
  };

  return (
    <form onSubmit={handleRegister} style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Create Account</h2>

      <input placeholder="Name" onChange={(e) => setName(e.target.value)} required />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="volunteer">Volunteer</option>
        <option value="org">Organization</option>
      </select>

      <button type="submit">Register</button>
    </form>
  );
}












