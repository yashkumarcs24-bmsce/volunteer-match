import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
import { AuthContext } from "../context/AuthContext";

export const useNotifications = () => {
  const { addNotification } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);

  const notifyApplicationApproved = (opportunityTitle) => {
    addNotification({
      type: 'application_approved',
      title: 'Application Approved! 🎉',
      message: `Your application for "${opportunityTitle}" has been approved!`,
      userId: user._id
    });
  };

  const notifyApplicationRejected = (opportunityTitle) => {
    addNotification({
      type: 'application_rejected',
      title: 'Application Update',
      message: `Your application for "${opportunityTitle}" was not selected this time.`,
      userId: user._id
    });
  };

  const notifyNewMessage = (senderName) => {
    addNotification({
      type: 'new_message',
      title: 'New Message 💬',
      message: `You have a new message from ${senderName}`,
      userId: user._id
    });
  };

  const notifyEventReminder = (opportunityTitle, timeUntil) => {
    addNotification({
      type: 'opportunity_reminder',
      title: 'Event Reminder 📅',
      message: `Your volunteer event "${opportunityTitle}" starts ${timeUntil}!`,
      userId: user._id
    });
  };

  const notifyNewApplication = (volunteerName, opportunityTitle) => {
    addNotification({
      type: 'new_application',
      title: 'New Application 📝',
      message: `${volunteerName} applied for "${opportunityTitle}"`,
      userId: user._id
    });
  };

  return {
    notifyApplicationApproved,
    notifyApplicationRejected,
    notifyNewMessage,
    notifyEventReminder,
    notifyNewApplication
  };
};