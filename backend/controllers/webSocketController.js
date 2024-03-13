const WebSocket = require('ws');

const handleConnection = (ws, wss) => {
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
};

module.exports = { handleConnection };