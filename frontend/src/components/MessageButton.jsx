import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function MessageButton({ userId, userName, className = "", eventTitle = null }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const startConversation = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user._id === userId) {
      toast.error("You can't message yourself");
      return;
    }

    // Create conversation data
    const otherUser = {
      _id: userId,
      name: userName,
      role: "volunteer" // Default role, could be passed as prop
    };

    // Store conversation starter info in localStorage for Messages page to pick up
    localStorage.setItem('startConversation', JSON.stringify({ otherUser, eventTitle }));
    
    navigate("/messages");
    toast.success(`Starting conversation with ${userName}`);
  };

  return (
    <button
      className={`btn btn-secondary ${className}`}
      onClick={startConversation}
      title={`Message ${userName}`}
    >
      💬 Message
    </button>
  );
}