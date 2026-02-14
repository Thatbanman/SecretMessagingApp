# SecretMessagingApp

A real-time global chat application that allows anyone to chat with others worldwide. The application features a WebSocket-based server hosted alongside a clean, modern web interface.

## Features

- 🌐 **Global Chat**: Connect and chat with users from anywhere
- ⚡ **Real-time Messaging**: Instant message delivery using WebSocket
- 👥 **User Count**: See how many users are online
- 💾 **Username Persistence**: Your username is saved locally
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔄 **Auto-reconnect**: Automatically reconnects if connection is lost

## Installation

1. Clone this repository:
```bash
git clone https://github.com/Thatbanman/SecretMessagingApp.git
cd SecretMessagingApp
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. Enter your username and start chatting!

## How It Works

- **Backend**: Node.js server with Express and WebSocket (ws library)
- **Frontend**: Vanilla HTML, CSS, and JavaScript
- **Communication**: WebSocket for real-time bidirectional communication
- **Server Hosting**: The server hosts both the WebSocket endpoint and static files

## Development

The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## Project Structure

```
SecretMessagingApp/
├── server.js           # WebSocket server and Express app
├── package.json        # Project dependencies
├── public/             # Frontend files
│   ├── index.html     # Main HTML page
│   ├── style.css      # Styling
│   └── client.js      # WebSocket client logic
└── README.md          # This file
```

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express**: Web server framework
- **WebSocket (ws)**: Real-time communication
- **HTML5/CSS3**: Modern web standards
- **JavaScript**: Client-side logic