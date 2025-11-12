import { FaHashtag, FaUser, FaCircle } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar({ 
  user, 
  users, 
  rooms, 
  currentRoom, 
  activeChat,
  onRoomChange, 
  onPrivateChat,
  unreadCounts,
  isConnected
}) {
  const otherUsers = users.filter(u => u.id !== user.id);

  const getUnreadCount = (type, id) => {
    const key = type === 'room' ? id : `private_${id}`;
    return unreadCounts[key] || 0;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="user-info">
          <img src={user.avatar} alt={user.username} className="user-avatar" />
          <div className="user-details">
            <h3>{user.username}</h3>
            <span className={`status ${isConnected ? 'online' : 'offline'}`}>
              <FaCircle /> {isConnected ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      <div className="sidebar-content">
        <div className="sidebar-section">
          <h4 className="section-title">Rooms</h4>
          <div className="room-list">
            {rooms.map(room => {
              const unread = getUnreadCount('room', room.id);
              const isActive = activeChat.type === 'room' && activeChat.id === room.id;
              
              return (
                <div
                  key={room.id}
                  className={`room-item ${isActive ? 'active' : ''}`}
                  onClick={() => onRoomChange(room.id)}
                >
                  <FaHashtag className="room-icon" />
                  <span className="room-name">{room.name}</span>
                  <span className="user-count">{room.userCount}</span>
                  {unread > 0 && <span className="unread-badge">{unread}</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="sidebar-section">
          <h4 className="section-title">Online Users ({otherUsers.length})</h4>
          <div className="user-list">
            {otherUsers.map(u => {
              const unread = getUnreadCount('private', u.id);
              const isActive = activeChat.type === 'private' && activeChat.id === u.id;
              
              return (
                <div
                  key={u.id}
                  className={`user-item ${isActive ? 'active' : ''}`}
                  onClick={() => onPrivateChat(u.id)}
                >
                  <div className="user-avatar-container">
                    <img src={u.avatar} alt={u.username} className="user-avatar-small" />
                    {u.online && <span className="online-indicator"></span>}
                  </div>
                  <span className="username">{u.username}</span>
                  {unread > 0 && <span className="unread-badge">{unread}</span>}
                </div>
              );
            })}
            {otherUsers.length === 0 && (
              <p className="empty-message">No other users online</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
