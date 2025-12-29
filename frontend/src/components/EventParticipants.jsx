import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import MessageButton from "./MessageButton";
import api from "../api/axios";

export default function EventParticipants({ opportunityId, opportunityTitle }) {
  const { user, dark } = useContext(AuthContext);
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showParticipants && opportunityId) {
      fetchParticipants();
    }
  }, [showParticipants, opportunityId]);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      // Fetch approved applications for this opportunity
      const res = await api.get(`/applications/opportunity/${opportunityId}`);
      const approvedApplications = res.data.filter(app => app.status === 'approved');
      
      // Extract user info from applications
      const participants = approvedApplications.map(app => ({
        _id: app.volunteer._id,
        name: app.volunteer.name,
        role: app.volunteer.role,
        avatar: app.volunteer.avatar,
        status: 'approved',
        joinedAt: new Date(app.createdAt)
      }));
      
      // Filter out current user
      const filteredParticipants = participants.filter(p => p._id !== user._id);
      setParticipants(filteredParticipants);
    } catch (error) {
      console.error("Failed to fetch participants:", error);
      // Fallback to empty array if API fails
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-participants">
      <button 
        className="participants-toggle"
        onClick={() => setShowParticipants(!showParticipants)}
      >
        👥 {showParticipants ? 'Hide' : 'Show'} Participants ({participants.length + 1})
      </button>

      {showParticipants && (
        <div className="participants-panel">
          <div className="participants-header">
            <h4>Event Participants</h4>
            <p>Connect with other volunteers in "{opportunityTitle}"</p>
          </div>

          {loading ? (
            <div className="participants-loading">
              <div className="spinner"></div>
              <span>Loading participants...</span>
            </div>
          ) : (
            <div className="participants-list">
              {participants.map(participant => (
                <div key={participant._id} className="participant-item">
                  <div className="participant-info">
                    <div className="participant-avatar">
                      {participant.avatar ? (
                        <img src={participant.avatar} alt={participant.name} />
                      ) : (
                        participant.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="participant-details">
                      <div className="participant-name">{participant.name}</div>
                      <div className="participant-meta">
                        <span className={`role-badge ${participant.role}`}>
                          {participant.role === 'org' ? '🏢 Organizer' : '🤝 Volunteer'}
                        </span>
                        <span className="join-date">
                          Joined {participant.joinedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <MessageButton 
                    userId={participant._id}
                    userName={participant.name}
                    className="btn-sm"
                    eventTitle={opportunityTitle}
                  />
                </div>
              ))}
              
              {participants.length === 0 && (
                <div className="no-participants">
                  <p>No other participants yet</p>
                  <span>Be the first to join this opportunity!</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}