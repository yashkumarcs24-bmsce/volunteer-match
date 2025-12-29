export default function SkillScoreBar({ score = 0, label = "Skill Match", showPercentage = true, size = "md" }) {
  const safeScore = Math.min(100, Math.max(0, score));
  
  const getScoreColor = (score) => {
    if (score >= 80) return "var(--success, #22c55e)";
    if (score >= 60) return "var(--warning, #fbbf24)";
    if (score >= 40) return "#f97316";
    return "var(--danger, #ef4444)";
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    if (score >= 40) return "Poor";
    return "Very Poor";
  };

  const sizes = {
    sm: { height: "6px", fontSize: "0.7rem" },
    md: { height: "8px", fontSize: "0.75rem" },
    lg: { height: "12px", fontSize: "0.85rem" }
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div className="skill-score-container">
      <div className="skill-score-header">
        <span className="skill-score-label">{label}</span>
        {showPercentage && (
          <span className="skill-score-value">
            {safeScore}% • {getScoreGrade(safeScore)}
          </span>
        )}
      </div>
      
      <div className="skill-score-track" style={{ height: currentSize.height }}>
        <div
          className="skill-score-fill"
          style={{
            width: `${safeScore}%`,
            background: `linear-gradient(90deg, ${getScoreColor(safeScore)}, ${getScoreColor(safeScore)}dd)`,
            height: "100%",
          }}
        />
        <div className="skill-score-glow" style={{ width: `${safeScore}%` }} />
      </div>
      
      <div className="skill-score-markers">
        {[25, 50, 75].map(marker => (
          <div 
            key={marker}
            className="skill-score-marker"
            style={{ left: `${marker}%` }}
          />
        ))}
      </div>
    </div>
  );
}