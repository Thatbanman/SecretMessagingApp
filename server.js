const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Store connected clients
const clients = new Set();

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New client connected');
  clients.add(ws);

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'system',
    message: 'Welcome to the global chat!',
    timestamp: new Date().toISOString()
  }));

  // Broadcast user count
  broadcastUserCount();

  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      
      // Validate message content
      if (!message.message || typeof message.message !== 'string') {
        return;
      }
      
      // Sanitize and limit message length
      const sanitizedMessage = message.message.trim().slice(0, 500);
      const sanitizedUsername = (message.username || 'Anonymous').trim().slice(0, 20);
      
      if (!sanitizedMessage) {
        return;
      }
      
      // Broadcast message to all clients
      const broadcastMessage = {
        type: 'message',
        username: sanitizedUsername,
        message: sanitizedMessage,
        timestamp: new Date().toISOString()
      };

      broadcast(JSON.stringify(broadcastMessage));
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  // Handle client disconnect
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
    broadcastUserCount();
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Broadcast message to all connected clients
function broadcast(message) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Broadcast current user count
function broadcastUserCount() {
  const countMessage = JSON.stringify({
    type: 'userCount',
    count: clients.size,
    timestamp: new Date().toISOString()
  });
  broadcast(countMessage);
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
