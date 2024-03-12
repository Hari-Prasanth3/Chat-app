const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');

// Create an HTTP server
const server = http.createServer((req, res) => {
    fs.readFile('index.html', (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

// Create a WebSocket server using the HTTP server
const wss = new WebSocket.Server({ server });

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('A new client connected');

    ws.on('message', (message) => {
        console.log('Received: %s', message);
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the HTTP server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`WebSocket server is running on port ${PORT}`);
});


