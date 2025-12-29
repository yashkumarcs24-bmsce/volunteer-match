import { useEffect, useState } from "react";
import { FiX, FiCheck, FiAlertCircle, FiInfo, FiAlertTriangle } from "react-icons/fi";

export default function Toast({ 
  message, 
  type = "info", 
  duration = 4000, 
  onClose,
  position = "top-right"
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      handleClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheck />;
      case "error":
        return <FiAlertCircle />;
      case "warning":
        return <FiAlertTriangle />;
      default:
        return <FiInfo />;
    }
  };

  return (
    <div 
      className={`toast toast-${type} toast-${position} ${
        isVisible && !isExiting ? 'toast-visible' : ''
      } ${isExiting ? 'toast-exiting' : ''}`}
    >
      <div className="toast-icon">
        {getIcon()}
      </div>
      <div className="toast-content">
        <p>{message}</p>
      </div>
      <button 
        className="toast-close"
        onClick={handleClose}
        aria-label="Close notification"
      >
        <FiX />
      </button>
    </div>
  );
}