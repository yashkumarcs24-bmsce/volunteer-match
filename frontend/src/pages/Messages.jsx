import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Messages() {
  const { user, dark } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch conversations from API
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await api.get('/messages/conversations');
        const conversationsData = Object.entries(response.data).map(([userId, conv]) => ({
          _id: userId,
          otherUser: conv.user,
          messages: conv.messages || [],
          lastMessage: conv.lastMessage,
          unreadCount: conv.unreadCount || 0,
          opportunityTitle: conv.opportunityTitle,
          applicationStatus: conv.applicationStatus
        }));
        setConversations(conversationsData);
      } catch (error) {
        console.error('Failed to load conversations:', error);
        toast.error('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (activeConversation) {
      // Messages are already loaded from the conversation
      setMessages(activeConversation.messages || []);
    }
  }, [activeConversation]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    try {
      const response = await api.post('/messages/send', {
        receiverId: activeConversation.otherUser._id,
        content: newMessage,
        eventContext: activeConversation.opportunityTitle ? {
          opportunityTitle: activeConversation.opportunityTitle
        } : null
      });
      
      const newMsg = response.data;
      setMessages(prev => [...prev, newMsg]);
      setNewMessage("");
      toast.success("Message sent!");
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const startConversation = (otherUser, eventTitle = null) => {
    const conversationId = `${Math.min(user._id, otherUser._id)}_${Math.max(user._id, otherUser._id)}`;
    
    // Check if conversation already exists
    let existingConv = conversations.find(conv => conv._id === conversationId);
    
    if (!existingConv) {
      // Create new conversation
      existingConv = {
        _id: conversationId,
        otherUser,
        lastMessage: null,
        unreadCount: 0,
        type: eventTitle ? "event" : "direct",
        eventTitle
      };
      
      const updatedConversations = [existingConv, ...conversations];
      setConversations(updatedConversations);
      
      try {
        localStorage.setItem(`conversations_${user._id}`, JSON.stringify(updatedConversations));
      } catch (error) {
        console.error('Failed to save conversation:', error);
      }
    }
    
    setActiveConversation(existingConv);
    return existingConv;
  };

  if (loading) {
    return (
      <div className={`messages-page ${dark ? "dark" : ""}`}>
        <div className="container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`messages-page ${dark ? "dark" : ""}`}>
      <div className="container">
        <div className="messages-layout">
          {/* Conversations Sidebar */}
          <div className="conversations-sidebar">
            <div className="sidebar-header">
              <h2>💬 Messages</h2>
            </div>
            
            <div className="conversations-list">
              {conversations.length === 0 ? (
                <div className="empty-conversations">
                  <p>No conversations yet</p>
                  <span>Start messaging other users!</span>
                </div>
              ) : (
                conversations.map(conv => (
                  <div
                    key={conv._id}
                    className={`conversation-item ${activeConversation?._id === conv._id ? 'active' : ''}`}
                    onClick={() => setActiveConversation(conv)}
                  >
                    <div className="conversation-avatar">
                      {conv.otherUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="conversation-info">
                      <div className="conversation-name">{conv.otherUser.name}</div>
                      {conv.opportunityTitle && (
                        <div className="opportunity-context">
                          🎯 {conv.opportunityTitle}
                          {conv.applicationStatus && (
                            <span className={`status-indicator ${conv.applicationStatus}`}>
                              • {conv.applicationStatus}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="conversation-preview">
                        {conv.lastMessage?.content || "Start a conversation"}
                      </div>
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="unread-badge">{conv.unreadCount}</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="chat-area">
            {activeConversation ? (
              <>
                <div className="chat-header">
                  <div className="chat-user-info">
                    <div className="chat-avatar">
                      {activeConversation.otherUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="chat-user-name">{activeConversation.otherUser.name}</div>
                      <div className="chat-user-role">{activeConversation.otherUser.role}</div>
                    </div>
                  </div>
                </div>

                <div className="messages-container">
                  {messages.map(message => (
                    <div
                      key={message._id}
                      className={`message ${message.senderId._id === user._id ? 'sent' : 'received'}`}
                    >
                      {message.eventContext?.opportunityTitle && (
                        <div className="event-context">
                          🎯 {message.eventContext.opportunityTitle}
                        </div>
                      )}
                      <div className="message-content">{message.content}</div>
                      <div className="message-time">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={sendMessage} className="message-input-form">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-input"
                  />
                  <button type="submit" className="send-button" disabled={!newMessage.trim()}>
                    📤
                  </button>
                </form>
              </>
            ) : (
              <div className="no-conversation">
                <div className="no-conversation-icon">💬</div>
                <h3>Select a conversation</h3>
                <p>Choose a conversation from the sidebar to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}