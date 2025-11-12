import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Store connected users
const users = new Map();
const rooms = new Map();
const privateMessages = new Map();

// Initialize default rooms
rooms.set('general', { name: 'General', users: new Set() });
rooms.set('random', { name: 'Random', users: new Set() });
rooms.set('tech', { name: 'Tech Talk', users: new Set() });

app.get('/', (req, res) => {
  res.json({ message: 'Chat server is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', users: users.size });
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user authentication
  socket.on('user:join', (userData) => {
    const user = {
      id: socket.id,
      username: userData.username,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
      online: true,
      currentRoom: 'general'
    };

    users.set(socket.id, user);
    socket.join('general');
    rooms.get('general').users.add(socket.id);

    // Notify user of successful join
    socket.emit('user:joined', {
      user,
      rooms: Array.from(rooms.entries()).map(([id, room]) => ({
        id,
        name: room.name,
        userCount: room.users.size
      }))
    });

    // Broadcast to all users
    io.emit('users:update', getUsersList());

    // Send system message
    io.to('general').emit('message:receive', {
      id: Date.now(),
      type: 'system',
      content: `${user.username} joined the chat`,
      timestamp: new Date().toISOString(),
      room: 'general'
    });
  });

  // Handle room joining
  socket.on('room:join', (roomId) => {
    const user = users.get(socket.id);
    if (!user) return;

    const currentRoom = user.currentRoom;
    
    // Leave current room
    if (currentRoom && rooms.has(currentRoom)) {
      socket.leave(currentRoom);
      rooms.get(currentRoom).users.delete(socket.id);
      
      io.to(currentRoom).emit('message:receive', {
        id: Date.now(),
        type: 'system',
        content: `${user.username} left the room`,
        timestamp: new Date().toISOString(),
        room: currentRoom
      });
    }

    // Join new room
    if (rooms.has(roomId)) {
      socket.join(roomId);
      rooms.get(roomId).users.add(socket.id);
      user.currentRoom = roomId;

      socket.emit('room:joined', {
        roomId,
        roomName: rooms.get(roomId).name
      });

      io.to(roomId).emit('message:receive', {
        id: Date.now(),
        type: 'system',
        content: `${user.username} joined the room`,
        timestamp: new Date().toISOString(),
        room: roomId
      });

      // Update room lists for all users
      io.emit('rooms:update', Array.from(rooms.entries()).map(([id, room]) => ({
        id,
        name: room.name,
        userCount: room.users.size
      })));
    }
  });

  // Handle message sending
  socket.on('message:send', (messageData) => {
    const user = users.get(socket.id);
    if (!user) return;

    const message = {
      id: Date.now() + Math.random(),
      type: 'user',
      content: messageData.content,
      sender: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      },
      timestamp: new Date().toISOString(),
      room: messageData.room || user.currentRoom,
      reactions: {},
      readBy: [socket.id]
    };

    // Send to room
    io.to(message.room).emit('message:receive', message);

    // Send acknowledgment to sender
    socket.emit('message:sent', { messageId: message.id, success: true });
  });

  // Handle private messages
  socket.on('private:send', ({ recipientId, content }) => {
    const sender = users.get(socket.id);
    const recipient = users.get(recipientId);
    
    if (!sender || !recipient) return;

    const message = {
      id: Date.now() + Math.random(),
      type: 'private',
      content,
      sender: {
        id: sender.id,
        username: sender.username,
        avatar: sender.avatar
      },
      recipient: {
        id: recipient.id,
        username: recipient.username
      },
      timestamp: new Date().toISOString(),
      read: false
    };

    // Send to recipient
    io.to(recipientId).emit('private:receive', message);
    
    // Send to sender (for their chat history)
    socket.emit('private:receive', message);

    // Store private message
    const conversationKey = [socket.id, recipientId].sort().join('-');
    if (!privateMessages.has(conversationKey)) {
      privateMessages.set(conversationKey, []);
    }
    privateMessages.get(conversationKey).push(message);
  });

  // Handle typing indicator
  socket.on('typing:start', ({ room, isPrivate, recipientId }) => {
    const user = users.get(socket.id);
    if (!user) return;

    if (isPrivate && recipientId) {
      io.to(recipientId).emit('typing:update', {
        userId: socket.id,
        username: user.username,
        isTyping: true,
        isPrivate: true
      });
    } else if (room) {
      socket.to(room).emit('typing:update', {
        userId: socket.id,
        username: user.username,
        isTyping: true,
        room
      });
    }
  });

  socket.on('typing:stop', ({ room, isPrivate, recipientId }) => {
    const user = users.get(socket.id);
    if (!user) return;

    if (isPrivate && recipientId) {
      io.to(recipientId).emit('typing:update', {
        userId: socket.id,
        username: user.username,
        isTyping: false,
        isPrivate: true
      });
    } else if (room) {
      socket.to(room).emit('typing:update', {
        userId: socket.id,
        username: user.username,
        isTyping: false,
        room
      });
    }
  });

  // Handle message reactions
  socket.on('message:react', ({ messageId, reaction, room }) => {
    const user = users.get(socket.id);
    if (!user) return;

    io.to(room).emit('message:reaction', {
      messageId,
      reaction,
      userId: socket.id,
      username: user.username
    });
  });

  // Handle read receipts
  socket.on('message:read', ({ messageId, room }) => {
    io.to(room).emit('message:read:update', {
      messageId,
      readBy: socket.id
    });
  });

  // Handle private message read
  socket.on('private:read', ({ senderId }) => {
    io.to(senderId).emit('private:read:update', {
      readBy: socket.id
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    
    if (user) {
      // Remove from rooms
      if (user.currentRoom && rooms.has(user.currentRoom)) {
        rooms.get(user.currentRoom).users.delete(socket.id);
        
        io.to(user.currentRoom).emit('message:receive', {
          id: Date.now(),
          type: 'system',
          content: `${user.username} left the chat`,
          timestamp: new Date().toISOString(),
          room: user.currentRoom
        });
      }

      users.delete(socket.id);
      
      // Update users list
      io.emit('users:update', getUsersList());
      
      // Update room lists
      io.emit('rooms:update', Array.from(rooms.entries()).map(([id, room]) => ({
        id,
        name: room.name,
        userCount: room.users.size
      })));

      console.log('User disconnected:', user.username);
    }
  });
});

function getUsersList() {
  return Array.from(users.values()).map(user => ({
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    online: user.online,
    currentRoom: user.currentRoom
  }));
}

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
