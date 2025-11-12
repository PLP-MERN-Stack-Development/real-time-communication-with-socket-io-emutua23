# 🚀 **Deployment Guide**

> _This guide will help you deploy your real-time chat application to production._

---

## 🎯 **Deployment Options**

---

### 🟢 **Option 1: Deploy to Render**

#### **Server Deployment**
1. **Create a new Web Service on [Render](https://render.com):**
   - Go to **render.com**
   - Click **"New +" → "Web Service"**
   - Connect your **GitHub repository**
   - Select the repository

2. **Configure the service:**
   - **Name:** `chat-server`
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node

3. **Add Environment Variables:**
   - `PORT`: _(Render sets this automatically)_
   - `CLIENT_URL`: _Your client URL (set after client deployment)_

4. **Deploy:**  
   Click **"Create Web Service"**

---

#### **Client Deployment to Vercel**
- **Install Vercel CLI:**
  ```bash
  npm install -g vercel
  ```
- **Navigate to client directory:**
  ```bash
  cd client
  ```
- **Deploy:**
  ```bash
  vercel
  ```
- **Update environment variable:**
  - Set `VITE_SERVER_URL` to your Render server URL

- **Update server CORS:**
  - Go back to Render
  - Update `CLIENT_URL` environment variable with Vercel URL
  - Redeploy server

---

### 🟡 **Option 2: Deploy to Railway**

#### **Server and Client Together**
- **Install Railway CLI:**
  ```bash
  npm install -g @railway/cli
  ```
- **Login to Railway:**
  ```bash
  railway login
  ```
- **Initialize project:**
  ```bash
  railway init
  ```
- **Deploy server:**
  ```bash
  cd server
  railway up
  ```
- **Deploy client:**
  ```bash
  cd ../client
  railway up
  ```
- **Configure environment variables in Railway dashboard**

---

### 🟣 **Option 3: Deploy to Heroku**

#### **Server Deployment**
- **Install Heroku CLI:**
  ```bash
  npm install -g heroku
  ```
- **Login to Heroku:**
  ```bash
  heroku login
  ```
- **Create a new app:**
  ```bash
  cd server
  heroku create your-chat-server
  ```
- **Set environment variables:**
  ```bash
  heroku config:set CLIENT_URL=your-client-url
  ```
- **Deploy:**
  ```bash
  git subtree push --prefix server heroku main
  ```

#### **Client Deployment to Netlify**
- **Install Netlify CLI:**
  ```bash
  npm install -g netlify-cli
  ```
- **Build the client:**
  ```bash
  cd client
  npm run build
  ```
- **Deploy:**
  ```bash
  netlify deploy --prod --dir=dist
  ```
- **Update environment variable:**
  - Add `VITE_SERVER_URL` in Netlify dashboard

---

## 🌱 **Environment Variables**

### **Server (.env)**
```env
PORT=3001
CLIENT_URL=https://your-client-url.com
```

### **Client (.env)**
```env
VITE_SERVER_URL=https://your-server-url.com
```

---

## ✅ **Post-Deployment Checklist**

- [x] Server is accessible and health endpoint returns 200
- [x] Client can connect to server
- [x] WebSocket connection works (check browser console)
- [x] CORS is properly configured
- [x] Environment variables are set correctly
- [x] SSL/HTTPS is enabled
- [x] Test all features (rooms, private messages, notifications)

---

## 🛠️ **Troubleshooting**

### ❌ **WebSocket Connection Failed**
- Ensure your hosting provider supports WebSocket connections
- Check if firewall or load balancer is blocking WebSocket protocol
- Verify SSL certificates are properly configured

### ⚠️ **CORS Issues**
- Double-check `CLIENT_URL` matches exactly (including protocol and trailing slash)
- Ensure server is deployed before updating client
- Check browser console for specific CORS errors

### 🧩 **Environment Variables Not Working**
- Restart services after updating environment variables
- For Vite, variables must start with `VITE_`
- Check if deployment platform requires different variable names

---

## 🚦 **Performance Optimization**

### **For Production**
- **Enable compression:**
  ```bash
  npm install compression
  ```
  Add to `server.js`:
  ```js
  import compression from 'compression';
  app.use(compression());
  ```
- **Use Redis for scaling:**
  ```bash
  npm install @socket.io/redis-adapter redis
  ```
- Enable sticky sessions if using multiple server instances
- Set up CDN for static assets
- Configure rate limiting to prevent abuse

---

## 📈 **Monitoring**

**Recommended Tools:**
- **Server:** New Relic, Datadog, or Render's built-in monitoring
- **Client:** Sentry for error tracking
- **WebSocket:** Socket.io Admin UI for real-time monitoring

---

## 🔒 **Security Checklist**

- [x] Use HTTPS/WSS in production
- [x] Implement rate limiting
- [x] Validate and sanitize all user inputs
- [x] Add authentication with JWT tokens
- [x] Use helmet.js for security headers
- [x] Enable CSRF protection
- [x] Keep dependencies updated

---

## 📊 **Scaling Considerations**

- **Horizontal Scaling:** Use Redis adapter for multiple server instances
- **Database:** Add PostgreSQL or MongoDB for message persistence
- **File Storage:** Use S3 or similar for file uploads
- **Load Balancer:** Configure sticky sessions for Socket.io

---

> For more help, refer to the official documentation:  
> [Socket.io Deployment](https://socket.io/docs/v4/deployment/) | [Render Documentation](https://render.com/docs) | [Vercel Documentation](https://vercel.com/docs)