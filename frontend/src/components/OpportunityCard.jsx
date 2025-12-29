import MessageButton from "./MessageButton";
import EventParticipants from "./EventParticipants";

export default function OpportunityCard({
  title,
  description,
  image,
  deadline,
  category,
  location,
  skills = [],
  createdBy,
  opportunityId,
  showParticipants = false,
  children,
}) {
  return (
    <div className="opportunity-card">
      {/* IMAGE */}
      {image && (
        <div className="op-card-image">
          <img
            src={image}
            alt={title}
            loading="lazy"
          />
        </div>
      )}

      {/* CONTENT */}
      <div className="card-content">
        <div className="card-header">
          <h3>{title}</h3>
          {category && <span className="category-tag">{category}</span>}
        </div>
        
        <p className="card-description">{description}</p>

        <div className="card-meta">
          {location && (
            <span className="meta-item">
              📍 {location}
            </span>
          )}
          <span className="meta-item">
            ⏰ {deadline}
          </span>
        </div>

        {skills.length > 0 && (
          <div className="card-skills">
            <span>Required Skills:</span>
            <div className="skills-list">
              {skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="skill-chip">{skill}</span>
              ))}
              {skills.length > 3 && (
                <span className="skill-chip more">+{skills.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        <div className="card-actions">
          {children}
          {createdBy && (
            <MessageButton 
              userId={createdBy._id} 
              userName={createdBy.name}
              className="btn-sm"
            />
          )}
        </div>

        {showParticipants && opportunityId && (
          <EventParticipants 
            opportunityId={opportunityId}
            opportunityTitle={title}
          />
        )}
      </div>
    </div>
  );
}
