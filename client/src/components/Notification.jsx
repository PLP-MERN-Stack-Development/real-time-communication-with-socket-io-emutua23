import { useEffect } from 'react';
import { FaTimes, FaComment, FaEnvelope } from 'react-icons/fa';
import './Notification.css';

function Notification({ notification, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case 'message':
        return <FaComment />;
      case 'private':
        return <FaEnvelope />;
      default:
        return <FaComment />;
    }
  };

  return (
    <div className="notification">
      <div className="notification-icon">{getIcon()}</div>
      <div className="notification-content">
        <h4>{notification.title}</h4>
        <p>{notification.content}</p>
      </div>
      <button className="notification-close" onClick={onClose}>
        <FaTimes />
      </button>
    </div>
  );
}

export default Notification;
