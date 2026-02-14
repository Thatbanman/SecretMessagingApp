// WebSocket connection
let ws;
let reconnectInterval;

// DOM elements
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const usernameInput = document.getElementById('usernameInput');
const sendButton = document.getElementById('sendButton');
const userCountSpan = document.getElementById('userCount');

// Load username from localStorage
const savedUsername = localStorage.getItem('chatUsername');
if (savedUsername) {
    usernameInput.value = savedUsername;
}

// Connect to WebSocket server
function connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    // Clear any existing reconnect interval
    if (reconnectInterval) {
        clearInterval(reconnectInterval);
        reconnectInterval = null;
    }
    
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log('Connected to chat server');
        sendButton.disabled = false;
        clearInterval(reconnectInterval);
        addSystemMessage('Connected to chat server');
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
                case 'system':
                    addSystemMessage(data.message);
                    break;
                case 'message':
                    addMessage(data.username, data.message, data.timestamp);
                    break;
                case 'userCount':
                    updateUserCount(data.count);
                    break;
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    };

    ws.onclose = () => {
        console.log('Disconnected from chat server');
        sendButton.disabled = true;
        addSystemMessage('Disconnected from server. Reconnecting...');
        
        // Attempt to reconnect every 3 seconds
        reconnectInterval = setInterval(() => {
            console.log('Attempting to reconnect...');
            connect();
        }, 3000);
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

// Send message
function sendMessage() {
    const message = messageInput.value.trim();
    const username = usernameInput.value.trim() || 'Anonymous';

    if (!message) {
        return;
    }

    if (ws && ws.readyState === WebSocket.OPEN) {
        // Save username to localStorage
        localStorage.setItem('chatUsername', username);

        // Send message to server
        ws.send(JSON.stringify({
            username: username,
            message: message
        }));

        // Clear input
        messageInput.value = '';
        messageInput.focus();
    } else {
        addSystemMessage('Not connected to server. Please wait...');
    }
}

// Add message to chat
function addMessage(username, message, timestamp) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';

    const headerDiv = document.createElement('div');
    headerDiv.className = 'message-header';

    const usernameSpan = document.createElement('span');
    usernameSpan.className = 'username';
    usernameSpan.textContent = username;

    const timestampSpan = document.createElement('span');
    timestampSpan.className = 'timestamp';
    timestampSpan.textContent = formatTime(timestamp);

    headerDiv.appendChild(usernameSpan);
    headerDiv.appendChild(timestampSpan);

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = message;

    messageDiv.appendChild(headerDiv);
    messageDiv.appendChild(textDiv);

    messagesDiv.appendChild(messageDiv);
    scrollToBottom();
}

// Add system message
function addSystemMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system';
    messageDiv.textContent = message;
    
    messagesDiv.appendChild(messageDiv);
    scrollToBottom();
}

// Update user count
function updateUserCount(count) {
    const plural = count === 1 ? 'user' : 'users';
    userCountSpan.textContent = `${count} ${plural} online`;
}

// Format timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Scroll to bottom of messages
function scrollToBottom() {
    messagesDiv.parentElement.scrollTop = messagesDiv.parentElement.scrollHeight;
}

// Event listeners
sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        messageInput.focus();
    }
});

// Initialize connection
connect();
