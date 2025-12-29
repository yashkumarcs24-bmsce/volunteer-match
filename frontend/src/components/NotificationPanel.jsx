import { useContext, useRef, useEffect } from "react";
import { NotificationContext } from "../context/NotificationContext";
import { FiBell, FiX, FiCheck } from "react-icons/fi";

export default function NotificationPanel({ isOpen, onClose }) {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    getNotificationIcon 
  } = useContext(NotificationContext);
  
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="notification-panel" ref={panelRef}>
      <div className="notification-header">
        <div className="notification-title">
          <FiBell />
          <span>Notifications</span>
          <button className="close-panel-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        {unreadCount > 0 && (
          <span className="notification-count">{unreadCount} new</span>
        )}
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="empty-notifications">
            <FiBell className="empty-icon" />
            <p>No notifications yet</p>
            <span>You're all caught up!</span>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content">
                <div className="notification-title-text">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">
                  {formatTimeAgo(notification.timestamp)}
                </div>
              </div>
              {!notification.read && (
                <button
                  className="mark-read-btn"
                  onClick={() => markAsRead(notification.id)}
                  title="Mark as read"
                >
                  <FiCheck />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && unreadCount > 0 && (
        <div className="notification-footer">
          <button className="mark-all-read-btn" onClick={markAllAsRead}>
            <FiCheck />
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
}