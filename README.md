# 💬 **Real-Time Chat Application**

A fully functional real-time chat app built with **Socket.io**, **React**, and **Node.js/Express** — demonstrating real-time, bidirectional communication between clients and server.

---

## 🎯 **Features Overview**

| Category         | Features                                                                                   |
|------------------|-------------------------------------------------------------------------------------------|
| **Core**         | Real-time messaging, user authentication, global chat rooms, private messaging, typing indicators, online/offline status |
| **Advanced**     | Multiple rooms/channels, direct messages, emoji reactions, unique avatars, system messages, read receipts |
| **Notifications**| In-app, browser, sound, unread badges, join/leave alerts                                  |
| **Performance**  | Auto-reconnect, typing timeout, smooth scrolling, message acknowledgment, responsive design, loading/error states |

---

## 🏗️ **Architecture**

| Layer     | Tech Stack / Details                                                                 |
|-----------|--------------------------------------------------------------------------------------|
| **Server**| Express.js, Socket.io, REST health endpoint, in-memory storage, CORS, event-driven   |
| **Client**| React (Vite), Socket.io-client, date-fns, react-icons, custom hooks, component-based |

---

## 📁 **Project Structure**

```
realtime-chat-app/
├── server/
│   ├── server.js          # Main server file with Socket.io logic
│   ├── package.json       # Server dependencies
│   └── .env               # Environment variables
├── client/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Login.jsx
│   │   │   ├── ChatRoom.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Notification.jsx
│   │   ├── socket.js      # Socket.io client configuration
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # Global styles
│   ├── package.json       # Client dependencies
│   └── .env               # Client environment variables
└── README.md              # This file
```

---

## 🚀 **Setup Instructions**

### **Prerequisites**

| Requirement    | Version/Details         |
|----------------|------------------------|
| Node.js        | v18+ ([Download](https://nodejs.org/)) |
| npm or yarn    | Package manager        |
| Web Browser    | Chrome, Firefox, Safari, Edge |

---

### **Installation Steps**

| Step | Command(s)                                  | Description                        |
|------|---------------------------------------------|------------------------------------|
| 1️⃣   | `cd realtime-chat-app`                      | Go to project root                 |
| 2️⃣   | <pre>cd server<br>npm install</pre>         | Install server dependencies        |
| 3️⃣   | <pre>cd ../client<br>npm install</pre>      | Install client dependencies        |

---

### **Running the Application**

| Terminal | Command(s)                | What Happens                        |
|----------|---------------------------|-------------------------------------|
| 1️⃣       | <pre>cd server<br>npm run dev</pre> | 🚀 Server runs on [http://localhost:3001](http://localhost:3001) |
| 2️⃣       | <pre>cd client<br>npm run dev</pre> | 🌐 Client runs on [http://localhost:5173](http://localhost:5173) |

---

## 🎮 **Usage Guide**

### **Getting Started**
- Enter a username (3-20 characters) on the login screen
- Click **"Join Chat"** to connect
- Start in the **General** room by default

### **Switching Rooms**
- Click any room in the sidebar (General, Random, Tech Talk)
- User count updates in real-time
- System messages show join/leave events

### **Private Messaging**
- Click any online user in the sidebar
- Send private messages (only visible to you and recipient)
- Unread badges show new private messages

### **Sending Messages**
- Type in the input field at the bottom
- Press **Enter** or click send
- Typing indicator shows when composing

### **Reacting to Messages**
- Hover over a message
- Click the smile icon
- Choose an emoji (👍, ❤️, 😂, etc.)
- Reactions appear below the message

### **Notifications**
- In-app notifications slide in from the top-right
- Browser notifications appear when tab is inactive (requires permission)
- Sound notifications play for new messages (can be muted)
- Unread badges show on rooms and private chats

---

## 🛠️ **Technologies Used**

| Backend         | Frontend         | Additional Tools        |
|-----------------|------------------|------------------------|
| Node.js         | React            | Nodemon                |
| Express.js      | Vite             | DiceBear Avatars API   |
| Socket.io       | Socket.io-client |                        |
| CORS            | date-fns         |                        |
| dotenv          | react-icons      |                        |

---

## 🔧 **Configuration**

### **Server Environment Variables (`server/.env`)**
```env
PORT=3001
CLIENT_URL=http://localhost:5173
```

### **Client Environment Variables (`client/.env`)**
```env
VITE_SERVER_URL=http://localhost:3001
```

---

## 📊 **Socket.io Events**

| Client → Server      | Server → Client         |
|----------------------|------------------------|
| `user:join`          | `user:joined`          |
| `room:join`          | `users:update`         |
| `message:send`       | `rooms:update`         |
| `private:send`       | `message:receive`      |
| `typing:start`       | `private:receive`      |
| `typing:stop`        | `typing:update`        |
| `message:react`      | `message:reaction`     |
| `message:read`       | `message:read:update`  |

---

## 🎨 **Features Showcase**

| Area         | Highlights                                                                 |
|--------------|----------------------------------------------------------------------------|
| **Login**    | Gradient background, modern design, username validation, animated entry    |
| **Sidebar**  | Rooms & users, unread badges, online status, responsive                    |
| **Chat Area**| Messages with avatars, timestamps, reactions, auto-scroll, typing indicator|
| **Notifications** | In-app, browser, sound, system messages                              |
| **Mobile**   | Fully responsive, touch-friendly, optimized layout                         |

---

## 🚧 **Future Enhancements**

- Message history persistence (database)
- File/image sharing
- Voice/video calls
- Message editing/deletion
- User profiles & custom avatars
- Channel creation by users
- Message search
- Dark mode
- Message encryption
- Admin roles & moderation

---

## 📝 **Development Notes**

- **Socket Connection:** Auto-connect on login, reconnection logic, clean disconnect
- **State Management:** React hooks for local state, socket events for global sync
- **Real-Time Updates:** Event-driven, broadcast vs. targeted, typing debouncing
- **User Experience:** Auto-scroll, visual feedback, error handling, loading states

---

## 🐛 **Troubleshooting**

| Problem                | Solution                                                                 |
|------------------------|--------------------------------------------------------------------------|
| Server won't start     | Check if port 3001 is in use, verify Node.js v18+, run `npm install`     |
| Client can't connect   | Ensure server is running, check `VITE_SERVER_URL`, verify CORS settings  |
| No notifications       | Grant browser notification permissions, check browser settings            |
| No sound               | Ensure audio file path is correct, check browser mute settings           |

---

## 📄 **License**

MIT License — Feel free to use this project for learning and development.

---

## 👨‍💻 **Author**

Built as a demonstration of real-time web application development with Socket.io.

---

## 🙏 **Acknowledgments**

- [Socket.io documentation](https://socket.io/docs/)
- [React](https://react.dev/)
- [DiceBear Avatars](https://avatars.dicebear.com/)
- The open source community

---

# 🎉 **Happy Chatting!** 💬🚀

_For questions or issues, please check the troubleshooting section or review the code comments._