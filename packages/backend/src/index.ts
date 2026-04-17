import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import {
  SOCKET_EVENTS,
  type CreateRoomPayload,
  type EnterRoomPayload,
  type Player,
} from '@gamesaola/shared'
import { createRoom, getRoom, joinRoom, leaveRoom, startRoom } from './roomManager'

const app = express()
app.use(cors())
app.use(express.json())

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: '*' },
})

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'gamesaola-backend' })
})

io.on('connection', (socket) => {
  console.log(`🟢 connected: ${socket.id}`)
  let currentRoomCode: string | null = null

  socket.on(SOCKET_EVENTS.CREATE_ROOM, (payload: CreateRoomPayload) => {
    const player: Player = { id: socket.id, nickname: payload.nickname }
    const room = createRoom(payload.gameId, payload.maxPlayers, player)
    currentRoomCode = room.code
    socket.join(room.code)
    socket.emit(SOCKET_EVENTS.ROOM_CREATED, room)
    console.log(`방 생성: ${room.code} (${payload.gameId})`)
  })

  socket.on(SOCKET_EVENTS.ENTER_ROOM, (payload: EnterRoomPayload) => {
    const player: Player = { id: socket.id, nickname: payload.nickname }
    const room = joinRoom(payload.code, player)
    if (!room) {
      socket.emit(SOCKET_EVENTS.ROOM_ERROR, { message: '방을 찾을 수 없거나 입장할 수 없습니다.' })
      return
    }
    currentRoomCode = room.code
    socket.join(room.code)
    socket.emit(SOCKET_EVENTS.ROOM_ENTERED, room)
    io.to(room.code).emit(SOCKET_EVENTS.ROOM_UPDATED, room)
    console.log(`방 입장: ${room.code} (${player.nickname})`)
  })

  socket.on(SOCKET_EVENTS.START_GAME, () => {
    if (!currentRoomCode) return
    const room = startRoom(currentRoomCode)
    if (!room) return
    io.to(currentRoomCode).emit(SOCKET_EVENTS.GAME_STARTED, room)
    console.log(`게임 시작: ${currentRoomCode}`)
  })

  socket.on('disconnect', () => {
    if (currentRoomCode) {
      const room = leaveRoom(currentRoomCode, socket.id)
      if (room) {
        io.to(currentRoomCode).emit(SOCKET_EVENTS.ROOM_UPDATED, room)
      }
    }
    console.log(`🔴 disconnected: ${socket.id}`)
  })
})

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  console.log(`🚀 GameSaola backend running on http://localhost:${PORT}`)
})