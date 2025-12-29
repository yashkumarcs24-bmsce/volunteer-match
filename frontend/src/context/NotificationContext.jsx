import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Temporarily disable Socket.IO for deployment
    // if (user && token) {
    //   const newSocket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:8000");
    //   
    //   newSocket.emit('join', user._id);
    //   
    //   newSocket.on('notification', (notification) => {
    //     addNotification(notification);
    //   });
    //   
    //   newSocket.on('new_message', (message) => {
    //     addNotification({
    //       type: 'new_message',
    //       title: 'New Message 💬',
    //       message: `New message from ${message.senderId.name}`,
    //       userId: user._id
    //     });
    //   });
    //   
    //   setSocket(newSocket);
    //   loadNotifications();

    //   return () => {
    //     newSocket.disconnect();
    //   };
    // }
    
    if (user) {
      loadNotifications();
    }
  }, [user, token]);

  const loadNotifications = () => {
    try {
      const saved = localStorage.getItem(`notifications_${user._id}`);
      if (saved) {
        const notifications = JSON.parse(saved);
        setNotifications(notifications);
        setUnreadCount(notifications.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const simulateNotification = () => {
    const mockNotifications = [
      {
        type: 'application_approved',
        title: 'Application Approved! 🎉',
        message: 'Your application for "Beach Cleanup Drive" has been approved!',
        userId: user._id
      },
      {
        type: 'application_rejected',
        title: 'Application Update',
        message: 'Your application for "Tree Planting Event" was not selected this time.',
        userId: user._id
      },
      {
        type: 'new_message',
        title: 'New Message 💬',
        message: 'You have a new message from Green Earth Foundation',
        userId: user._id
      },
      {
        type: 'opportunity_reminder',
        title: 'Event Reminder 📅',
        message: 'Your volunteer event "Community Garden" starts tomorrow!',
        userId: user._id
      }
    ];

    const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
    addNotification(randomNotification);
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      ...notification,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Save to localStorage
    const updated = [newNotification, ...notifications];
    localStorage.setItem(`notifications_${user._id}`, JSON.stringify(updated));
    
    // Show toast notification
    toast.success(notification.title, {
      duration: 4000,
      icon: getNotificationIcon(notification.type)
    });
  };

  const markAsRead = (notificationId) => {
    try {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Update localStorage
      const updated = notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem(`notifications_${user._id}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      
      // Update localStorage
      const updated = notifications.map(n => ({ ...n, read: true }));
      localStorage.setItem(`notifications_${user._id}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const clearNotifications = () => {
    try {
      setNotifications([]);
      setUnreadCount(0);
      localStorage.removeItem(`notifications_${user._id}`);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application_approved': return '✅';
      case 'application_rejected': return '❌';
      case 'new_message': return '💬';
      case 'opportunity_reminder': return '📅';
      case 'new_application': return '📝';
      default: return '🔔';
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      getNotificationIcon
    }}>
      {children}
    </NotificationContext.Provider>
  );
};