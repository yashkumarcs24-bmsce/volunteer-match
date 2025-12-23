import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Applicants() {
  const { token } = useContext(AuthContext);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/applications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setApps);
  }, []);

  return (
    <div className="card">
      <h2>Applicants</h2>

      {apps.length === 0 && <p>No applicants yet</p>}

      {apps.map((a) => (
        <div key={a._id} className="box">
          <p><strong>Name:</strong> {a.applicant?.name}</p>
          <p><strong>Email:</strong> {a.applicant?.email}</p>
          <p><strong>Opportunity:</strong> {a.opportunity?.title}</p>
          <p><strong>Status:</strong> {a.status}</p>
        </div>
      ))}
    </div>
  );
}











