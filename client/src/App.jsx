import { useState, useEffect, useRef } from 'react';
import { socket } from './socket';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import Sidebar from './components/Sidebar';
import Notification from './components/Notification';
import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [messages, setMessages] = useState({});
  const [privateChats, setPrivateChats] = useState({});
  const [activeChat, setActiveChat] = useState({ type: 'room', id: 'general' });
  const [typingUsers, setTypingUsers] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const audioRef = useRef(null);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onUserJoined(data) {
      setUser(data.user);
      setRooms(data.rooms);
      setCurrentRoom(data.user.currentRoom);
      setActiveChat({ type: 'room', id: data.user.currentRoom });
    }

    function onUsersUpdate(usersList) {
      setUsers(usersList);
    }

    function onRoomsUpdate(roomsList) {
      setRooms(roomsList);
    }

    function onMessageReceive(message) {
      const roomId = message.room;
      setMessages(prev => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), message]
      }));

      // Play notification sound
      if (message.sender && message.sender.id !== socket.id) {
        playNotificationSound();
        
        // Show browser notification if not in focus
        if (document.hidden) {
          showBrowserNotification(
            `New message from ${message.sender.username}`,
            message.content
          );
        }

        // Update unread count if not on this room
        if (activeChat.type !== 'room' || activeChat.id !== roomId) {
          setUnreadCounts(prev => ({
            ...prev,
            [roomId]: (prev[roomId] || 0) + 1
          }));
        }

        // Show in-app notification
        addNotification({
          type: 'message',
          title: `${message.sender.username} in ${rooms.find(r => r.id === roomId)?.name || roomId}`,
          content: message.content
        });
      }
    }

    function onPrivateReceive(message) {
      const chatId = message.sender.id === socket.id 
        ? message.recipient.id 
        : message.sender.id;

      setPrivateChats(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), message]
      }));

      // Notifications only for received messages
      if (message.sender.id !== socket.id) {
        playNotificationSound();
        
        if (document.hidden) {
          showBrowserNotification(
            `Private message from ${message.sender.username}`,
            message.content
          );
        }

        if (activeChat.type !== 'private' || activeChat.id !== chatId) {
          setUnreadCounts(prev => ({
            ...prev,
            [`private_${chatId}`]: (prev[`private_${chatId}`] || 0) + 1
          }));
        }

        addNotification({
          type: 'private',
          title: `Private message from ${message.sender.username}`,
          content: message.content
        });
      }
    }

    function onTypingUpdate(data) {
      if (data.isPrivate) {
        setTypingUsers(prev => ({
          ...prev,
          [`private_${data.userId}`]: data.isTyping ? data.username : null
        }));
      } else {
        setTypingUsers(prev => ({
          ...prev,
          [data.room]: data.isTyping ? data.username : null
        }));
      }

      // Clear typing after 3 seconds
      setTimeout(() => {
        if (data.isPrivate) {
          setTypingUsers(prev => ({
            ...prev,
            [`private_${data.userId}`]: null
          }));
        } else {
          setTypingUsers(prev => ({
            ...prev,
            [data.room]: null
          }));
        }
      }, 3000);
    }

    function onMessageReaction(data) {
      const roomId = currentRoom;
      setMessages(prev => {
        const roomMessages = prev[roomId] || [];
        return {
          ...prev,
          [roomId]: roomMessages.map(msg => 
            msg.id === data.messageId 
              ? {
                  ...msg,
                  reactions: {
                    ...msg.reactions,
                    [data.reaction]: [...(msg.reactions?.[data.reaction] || []), {
                      userId: data.userId,
                      username: data.username
                    }]
                  }
                }
              : msg
          )
        };
      });
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('user:joined', onUserJoined);
    socket.on('users:update', onUsersUpdate);
    socket.on('rooms:update', onRoomsUpdate);
    socket.on('message:receive', onMessageReceive);
    socket.on('private:receive', onPrivateReceive);
    socket.on('typing:update', onTypingUpdate);
    socket.on('message:reaction', onMessageReaction);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('user:joined', onUserJoined);
      socket.off('users:update', onUsersUpdate);
      socket.off('rooms:update', onRoomsUpdate);
      socket.off('message:receive', onMessageReceive);
      socket.off('private:receive', onPrivateReceive);
      socket.off('typing:update', onTypingUpdate);
      socket.off('message:reaction', onMessageReaction);
    };
  }, [currentRoom, activeChat, rooms]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleLogin = (username) => {
    socket.connect();
    socket.emit('user:join', { username });
  };

  const handleRoomChange = (roomId) => {
    setCurrentRoom(roomId);
    setActiveChat({ type: 'room', id: roomId });
    socket.emit('room:join', roomId);
    // Clear unread count
    setUnreadCounts(prev => ({ ...prev, [roomId]: 0 }));
  };

  const handlePrivateChat = (userId) => {
    setActiveChat({ type: 'private', id: userId });
    setUnreadCounts(prev => ({ ...prev, [`private_${userId}`]: 0 }));
  };

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const showBrowserNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/vite.svg',
        badge: '/vite.svg'
      });
    }
  };

  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
      
      <Sidebar
        user={user}
        users={users}
        rooms={rooms}
        currentRoom={currentRoom}
        activeChat={activeChat}
        onRoomChange={handleRoomChange}
        onPrivateChat={handlePrivateChat}
        unreadCounts={unreadCounts}
        isConnected={isConnected}
      />

      <ChatRoom
        user={user}
        activeChat={activeChat}
        messages={activeChat.type === 'room' ? messages[activeChat.id] || [] : privateChats[activeChat.id] || []}
        users={users}
        typingUser={typingUsers[activeChat.type === 'room' ? activeChat.id : `private_${activeChat.id}`]}
      />

      <div className="notifications">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
