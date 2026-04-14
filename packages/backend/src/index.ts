import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { SOCKET_EVENTS } from '@gamesaola/shared';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: '*' }
});

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'gamesaola-backend' });
});

io.on('connection', (socket) => {
    console.log(`O connected: ${socket.id}`);

    socket.on(SOCKET_EVENTS.JOIN_ROOM, (roomCode: string) => {
        socket.join(roomCode);
        console.log(`${socket.id} joined room: ${roomCode}`);
    });

    socket.on(SOCKET_EVENTS.LEAVE_ROOM, (roomCode: string) => {
        socket.leave(roomCode);
        console.log(`${socket.id} left room: ${roomCode}`);
    });

    socket.on('disconnect', () => {
        console.log(`X disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 4000;
    httpServer.listen(PORT, () => {
    console.log(`GameSaola backend running on http://localhost:${PORT}`);
});
