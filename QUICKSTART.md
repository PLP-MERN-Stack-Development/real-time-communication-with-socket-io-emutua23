⚡ Quick Start Guide
Get the chat application up and running in 5 minutes!

🎯 Prerequisites
Make sure you have:

✅ Node.js v18 or higher (Download)
✅ npm (comes with Node.js)
✅ A modern web browser
Check your versions:

bash
node --version  # Should be v18 or higher
npm --version   # Should be 8 or higher
🚀 Installation (3 steps)
Step 1: Navigate to the project
bash
cd realtime-chat-app
Step 2: Install server dependencies
bash
cd server
npm install
Step 3: Install client dependencies
bash
cd ../client
npm install
▶️ Running the Application
You need two terminal windows.

Terminal 1 - Start the Server
bash
cd server
npm run dev
You should see:

🚀 Server running on port 3001
Terminal 2 - Start the Client
bash
cd client
npm run dev
You should see:



  VITE v7.2.2  ready in 411 ms
  ➜  Local:   http://localhost:5173/
🎮 Using the Application
Open your browser to http://localhost:5173

Enter a username (3-20 characters)

Start chatting!

🧪 Testing Multiple Users
To simulate multiple users:

Open http://localhost:5173 in multiple browser tabs
Use a different username in each tab
Watch messages appear in real-time across all tabs!
Pro tip: Use incognito/private windows for truly separate sessions.

🎯 What to Try
Basic Features
✉️ Send messages in the General room
🔄 Switch to Random or Tech Talk rooms
👥 Click on a user to start a private chat
⌨️ Type to see the typing indicator
👍 React to messages with emojis
Advanced Features
🔔 Open a new tab and see notifications
📱 Resize your browser to see responsive design
🔌 Disconnect/reconnect to test auto-reconnection
💬 Send messages in different rooms and see unread badges
🛠️ Troubleshooting
Server won't start?
Error: "Port 3001 is already in use"

Solution: Kill the process using that port:

bash
# On macOS/Linux
lsof -ti:3001 | xargs kill -9

# On Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
Client won't connect?
Error: "WebSocket connection failed"

Solution:

Make sure the server is running first
Check that server URL is correct in client/.env
Clear browser cache and reload
Dependencies failing to install?
Error: npm install fails

Solution:

bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Try again
npm install
Notifications not working?
Issue: No browser notifications appear

Solution:

Click the 🔔 icon in browser address bar
Allow notifications for localhost
Refresh the page
📁 Project Structure (Quick Overview)


realtime-chat-app/
├── server/              # Backend (Socket.io server)
│   ├── server.js        # Main server file
│   └── package.json     # Server dependencies
├── client/              # Frontend (React app)
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.jsx      # Main app
│   │   └── socket.js    # Socket.io client
│   └── package.json     # Client dependencies
└── README.md            # Full documentation
🎓 Next Steps
Once you're comfortable with the basics:

📖 Read the full README.md  for detailed documentation
🎯 Explore FEATURES.md for feature explanations
🚀 Check out DEPLOYMENT.md to deploy your app
🛠️ Modify the code and experiment!
💡 Quick Tips
Keyboard Shortcuts: Press Enter to send messages
Copy Links: Share http://localhost:5173 with friends on your network
Dev Tools: Open browser console (F12) to see Socket.io events
Hot Reload: Changes to code auto-reload the app
🆘 Still Need Help?
Check the README.md for detailed information
Look at the FEATURES.md  for feature documentation
Review the code comments in the source files
Check browser console for error messages
🎉 You're All Set!
Enjoy chatting! 💬🚀

Time to complete: ~5 minutes Difficulty: Beginner-friendly Prerequisites: Node.js installed