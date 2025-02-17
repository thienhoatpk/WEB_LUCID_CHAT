import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to backend

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Listen for notifications from the backend
    socket.on('notification', (data) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        data.message,
      ]);
    });

    return () => {
      socket.off('notification'); // Cleanup on unmount
    };
  }, []);

  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationComponent;
