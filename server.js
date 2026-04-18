// server.js

const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Connect to SQLite database
const db = new sqlite3.Database('transactions.db', (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// When a client connects
wss.on('connection', (ws) => {
    console.log('Client connected');

    // When a message is received from the client
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);

        // Save transaction to SQLite database
        db.run(`INSERT INTO transactions (message) VALUES (?)`, [message], (err) => {
            if (err) {
                console.error('Error inserting transaction', err);
            } else {
                console.log('Transaction saved to database');
            }
        });
    });

    // When the connection is closed
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is listening on ws://localhost:8080');