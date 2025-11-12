import { useState, useEffect, useRef } from 'react';
import { socket } from '../socket';
import { format } from 'date-fns';
import { FaPaperPlane, FaSmile, FaHeart, FaThumbsUp, FaLaugh } from 'react-icons/fa';
import './ChatRoom.css';

function ChatRoom({ user, activeChat, messages, users, typingUser }) {
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🔔 NEW: Play sound for incoming messages
  useEffect(() => {
    const handleIncomingMessage = (message) => {
      const isOwnMessage = message?.sender?.id === socket.id;
      // Only play sound for messages NOT sent by you
      if (!isOwnMessage && message?.type !== 'system') {
        const audio = new Audio('/notification.mp3');
        audio.play().catch((err) => {
          console.warn('Audio playback failed:', err);
        });
      }
    };

    socket.on('message:receive', handleIncomingMessage);
    socket.on('private:receive', handleIncomingMessage);

    return () => {
      socket.off('message:receive', handleIncomingMessage);
      socket.off('private:receive', handleIncomingMessage);
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;

    if (activeChat.type === 'room') {
      socket.emit('message:send', {
        content: messageInput,
        room: activeChat.id
      });
    } else {
      socket.emit('private:send', {
        recipientId: activeChat.id,
        content: messageInput
      });
    }

    setMessageInput('');
    handleStopTyping();
  };

  const handleTyping = () => {
    if (activeChat.type === 'room') {
      socket.emit('typing:start', { room: activeChat.id });
    } else {
      socket.emit('typing:start', { isPrivate: true, recipientId: activeChat.id });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(handleStopTyping, 2000);
  };

  const handleStopTyping = () => {
    if (activeChat.type === 'room') {
      socket.emit('typing:stop', { room: activeChat.id });
    } else {
      socket.emit('typing:stop', { isPrivate: true, recipientId: activeChat.id });
    }
  };

  const handleReaction = (messageId, reaction) => {
    socket.emit('message:react', {
      messageId,
      reaction,
      room: activeChat.id
    });
    setShowEmojiPicker(null);
  };

  const reactions = [
    { emoji: '👍', name: 'thumbsup', icon: FaThumbsUp },
    { emoji: '❤️', name: 'heart', icon: FaHeart },
    { emoji: '😂', name: 'laugh', icon: FaLaugh },
    { emoji: '😮', name: 'wow' },
    { emoji: '😢', name: 'sad' },
    { emoji: '🎉', name: 'party' }
  ];

  const getChatTitle = () => {
    if (activeChat.type === 'room') {
      return `# ${activeChat.id}`;
    } else {
      const otherUser = users.find(u => u.id === activeChat.id);
      return otherUser ? `@ ${otherUser.username}` : 'Private Chat';
    }
  };

  const getOtherUser = () => {
    if (activeChat.type === 'private') {
      return users.find(u => u.id === activeChat.id);
    }
    return null;
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <h2>{getChatTitle()}</h2>
        {activeChat.type === 'private' && getOtherUser() && (
          <div className="header-user-info">
            <img 
              src={getOtherUser().avatar} 
              alt={getOtherUser().username} 
              className="header-avatar"
            />
            <span className="header-username">{getOtherUser().username}</span>
          </div>
        )}
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <FaSmile size={48} />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            if (message.type === 'system') {
              return (
                <div key={message.id || index} className="system-message">
                  {message.content}
                </div>
              );
            }

            const isOwnMessage = message.sender?.id === socket.id;
            const showAvatar = index === 0 || 
              messages[index - 1]?.sender?.id !== message.sender?.id;

            return (
              <div
                key={message.id || index}
                className={`message ${isOwnMessage ? 'own-message' : ''}`}
              >
                {!isOwnMessage && showAvatar && (
                  <img
                    src={message.sender?.avatar}
                    alt={message.sender?.username}
                    className="message-avatar"
                  />
                )}
                {!isOwnMessage && !showAvatar && (
                  <div className="message-avatar-spacer"></div>
                )}
                
                <div className="message-content-wrapper">
                  {showAvatar && (
                    <div className="message-header">
                      <span className="message-sender">{message.sender?.username}</span>
                      <span className="message-time">
                        {format(new Date(message.timestamp), 'HH:mm')}
                      </span>
                    </div>
                  )}
                  <div className="message-content">
                    <p>{message.content}</p>
                    {!isOwnMessage && (
                      <button
                        className="reaction-button"
                        onClick={() => setShowEmojiPicker(
                          showEmojiPicker === message.id ? null : message.id
                        )}
                      >
                        <FaSmile />
                      </button>
                    )}
                    
                    {showEmojiPicker === message.id && (
                      <div className="emoji-picker">
                        {reactions.map(reaction => (
                          <button
                            key={reaction.name}
                            className="emoji-option"
                            onClick={() => handleReaction(message.id, reaction.name)}
                          >
                            {reaction.emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {message.reactions && Object.keys(message.reactions).length > 0 && (
                    <div className="message-reactions">
                      {Object.entries(message.reactions).map(([reactionName, users]) => {
                        const reaction = reactions.find(r => r.name === reactionName);
                        if (!users || users.length === 0) return null;
                        
                        return (
                          <span key={reactionName} className="reaction-badge">
                            {reaction?.emoji} {users.length}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        
        {typingUser && (
          <div className="typing-indicator-container">
            <span className="typing-text">{typingUser} is typing</span>
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => {
            setMessageInput(e.target.value);
            handleTyping();
          }}
          placeholder={`Message ${activeChat.type === 'room' ? '#' + activeChat.id : getOtherUser()?.username || ''}`}
          className="message-input"
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!messageInput.trim()}
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}

export default ChatRoom;
