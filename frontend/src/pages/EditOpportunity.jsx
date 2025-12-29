import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function EditOpportunity() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8000/api/opportunities/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setDescription(data.description);
        setDeadline(data.deadline?.split("T")[0]);
        setImage(data.image || "");
      });
  }, [id, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:8000/api/opportunities/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        deadline,
        image,
      }),
    });

    navigate("/dashboard");
  };

  return (
    <div className="page center-page">
      <h2>Edit Opportunity</h2>

      <form className="auth-form" onSubmit={handleUpdate}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <input
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        {image && (
          <img
            src={image}
            alt="preview"
            className="opportunity-image"
          />
        )}

        <button className="btn-primary">Update</button>
      </form>
    </div>
  );
}
