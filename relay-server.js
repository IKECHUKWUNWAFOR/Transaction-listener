const WebSocket = require('ws');

// Create a new WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// List to keep track of connected clients
const clients = new Map();

// Function to broadcast messages to all clients
function broadcast(message, sender) {
    clients.forEach((client, clientId) => {
        if (client !== sender) {
            client.send(message);
        }
    });
}

// Function to handle missed packet delivery
function handleMissedPackets(clientId) {
    // Logic to resend missed packets based on clientId
    console.log(`Resending missed packets to client: ${clientId}`);
}

// Function to purge clients that haven't been active
function purgeInactiveClients() {
    const purgeThreshold = 30000; // 30 seconds
    const now = Date.now();
    clients.forEach((client, clientId) => {
        if (now - client.lastActive > purgeThreshold) {
            client.close();
            clients.delete(clientId);
            console.log(`Purged inactive client: ${clientId}`);
        }
    });
}

// Setting up WebSocket connections
wss.on('connection', (ws, req) => {
    const clientId = req.url; // Use URL as a unique identifier
    clients.set(clientId, { client: ws, lastActive: Date.now() });

    ws.on('message', (message) => {
        console.log(`Received message from ${clientId}: ${message}`);
        broadcast(message, ws);
        clients.get(clientId).lastActive = Date.now(); // Update last active time
    });

    ws.on('close', () => {
        clients.delete(clientId);
        console.log(`Client disconnected: ${clientId}`);
    });
});

// Periodically purge inactive clients
setInterval(purgeInactiveClients, 60000); // Purge every minute

console.log('WebSocket relay server is running on ws://localhost:8080');
