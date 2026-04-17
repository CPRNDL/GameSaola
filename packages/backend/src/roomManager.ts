import type { Room, Player, GameId } from '@gamesaola/shared'

const rooms = new Map<string, Room>()

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return rooms.has(code) ? generateCode() : code
}

export function createRoom(gameId: GameId, maxPlayers: number, player: Player): Room {
  const code = generateCode()
  const room: Room = {
    code,
    gameId,
    status: 'waiting',
    players: [player],
    maxPlayers,
  }
  rooms.set(code, room)
  return room
}

export function getRoom(code: string): Room | undefined {
  return rooms.get(code)
}

export function joinRoom(code: string, player: Player): Room | null {
  const room = rooms.get(code)
  if (!room) return null
  if (room.status !== 'waiting') return null
  if (room.players.length >= room.maxPlayers) return null
  if (room.players.find((p) => p.id === player.id)) return room
  room.players.push(player)
  return room
}

export function leaveRoom(code: string, playerId: string): Room | null {
  const room = rooms.get(code)
  if (!room) return null
  room.players = room.players.filter((p) => p.id !== playerId)
  if (room.players.length === 0) {
    rooms.delete(code)
    return null
  }
  return room
}

export function startRoom(code: string): Room | null {
  const room = rooms.get(code)
  if (!room) return null
  room.status = 'playing'
  return room
}