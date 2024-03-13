const WebSocket = require('ws');
const http = require('http');
const { handleConnection } = require('./controllers/webSocketController');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('WebSocket server is running');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => handleConnection(ws, wss));

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`WebSocket server is running on port ${PORT}`);
});