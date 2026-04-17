import { useState, useEffect } from 'react'
import { SOCKET_EVENTS, type Room, type RoomErrorPayload } from '@gamesaola/shared'
import { useSocket } from './useSocket'

export function useRoom() {
  const socket = useSocket()
  const [room, setRoom] = useState<Room | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    socket.on(SOCKET_EVENTS.ROOM_CREATED, (r: Room) => {
      setRoom(r)
      setLoading(false)
    })

    socket.on(SOCKET_EVENTS.ROOM_ENTERED, (r: Room) => {
      setRoom(r)
      setLoading(false)
    })

    socket.on(SOCKET_EVENTS.ROOM_UPDATED, (r: Room) => {
      setRoom(r)
    })

    socket.on(SOCKET_EVENTS.ROOM_ERROR, (payload: RoomErrorPayload) => {
      setError(payload.message)
      setLoading(false)
    })

    socket.on(SOCKET_EVENTS.GAME_STARTED, (r: Room) => {
      setRoom(r)
    })

    return () => {
      socket.off(SOCKET_EVENTS.ROOM_CREATED)
      socket.off(SOCKET_EVENTS.ROOM_ENTERED)
      socket.off(SOCKET_EVENTS.ROOM_UPDATED)
      socket.off(SOCKET_EVENTS.ROOM_ERROR)
      socket.off(SOCKET_EVENTS.GAME_STARTED)
    }
  }, [socket])

  function createRoom(gameId: string, maxPlayers: number, nickname: string) {
    setLoading(true)
    setError(null)
    socket.emit(SOCKET_EVENTS.CREATE_ROOM, { gameId, maxPlayers, nickname })
  }

  function enterRoom(code: string, nickname: string) {
    setLoading(true)
    setError(null)
    socket.emit(SOCKET_EVENTS.ENTER_ROOM, { code: code.toUpperCase(), nickname })
  }

  function startGame() {
    socket.emit(SOCKET_EVENTS.START_GAME)
  }

  return { room, error, loading, createRoom, enterRoom, startGame }
}