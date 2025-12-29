import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/timeline.css";

export default function Timeline({ history = [] }) {
  return (
    <div className="timeline">
      {history.map((h, i) => {
        const isLatest = i === history.length - 1;

        return (
          <div
            key={i}
            className={`timeline-item glow-${h.status} ${
              isLatest ? "pulse-status" : ""
            }`}
          >
            <span className={`timeline-icon ${h.status}`}>
              {h.status === "pending" && "⏳"}
              {h.status === "approved" && "✅"}
              {h.status === "rejected" && "❌"}
              {h.status === "cancelled" && "🚫"}
            </span>
            <div className="timeline-text">
              <b>{h.status.toUpperCase()}</b> —{" "}
              {new Date(h.changedAt).toLocaleDateString("en-IN")}
            </div>
          </div>
        );
      })}
    </div>
  );
}

