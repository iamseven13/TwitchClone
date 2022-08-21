const express = require('express');
const connectDB = require('./config/db');
const router = require('./router');
var cors = require('cors');
var jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
const payments = require('./payments/payments');

const app = express();
const port = 2000;

connectDB();
app.use(cors());
// Add middleware
app.use(express.json({ extended: false }));

app.use('/', router);

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});

const connectedUsers = [];

io.on('connection', (socket) => {
	// console.log(`user connected ${socket.id}`);

	socket.on('join_room', (data) => {
		socket.join(data);
	});

	socket.on('send_message', (data) => {
		socket.to(data.roomName).emit('receive_message', data);
		console.log(data);
		// socket.to(data.roomName).
	});
});

server.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
