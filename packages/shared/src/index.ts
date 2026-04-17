export const SOCKET_EVENTS = {
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  GAME_STATE: 'game_state',
  PLAYER_MOVE: 'player_move',
  CREATE_ROOM: 'create_room',
  ROOM_CREATED: 'room_created',
  ENTER_ROOM: 'enter_room',
  ROOM_ENTERED: 'room_entered',
  ROOM_UPDATED: 'room_updated',
  ROOM_ERROR: 'room_error',
  START_GAME: 'start_game',
  GAME_STARTED: 'game_started',
} as const

export type GameId =
  | 'omok'
  | 'chess'
  | 'baduk'
  | 'janggi'
  | 'checker'
  | 'yacht'
  | 'onecard'
  | 'through-the-ages'

export type RoomStatus = 'waiting' | 'playing' | 'finished'

export interface Player {
  id: string
  nickname: string
}

export interface Room {
  code: string
  gameId: GameId
  status: RoomStatus
  players: Player[]
  maxPlayers: number
}

export interface CreateRoomPayload {
  gameId: GameId
  maxPlayers: number
  nickname: string
}

export interface EnterRoomPayload {
  code: string
  nickname: string
}

export interface RoomErrorPayload {
  message: string
}