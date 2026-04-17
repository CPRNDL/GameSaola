import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GAMES } from '../data/games'
import { useRoom } from '../hooks/useRoom'
import type { GameId } from '@gamesaola/shared'

export default function LobbyPage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const game = GAMES.find((g) => g.id === gameId)
  const { room, error, loading, createRoom, enterRoom, startGame } = useRoom()

  const [nickname, setNickname] = useState('')
  const [roomCode, setRoomCode] = useState('')

  if (!game) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 text-brown-700">
        게임을 찾을 수 없습니다.
      </div>
    )
  }

  if (room) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-medium text-brown-900 mb-2">{game.titleKo} 대기실</h1>

        <div className="bg-ivory border border-brown-100 rounded-2xl p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-brown-600 text-sm">방 코드</span>
            <span className="text-2xl font-medium text-brown-900 tracking-widest">{room.code}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-brown-600 mb-6">
            <span>플레이어 {room.players.length} / {room.maxPlayers}</span>
            <span>{room.status === 'waiting' ? '대기 중' : '게임 중'}</span>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            {room.players.map((player, i) => (
              <div key={player.id} className="flex items-center gap-3 px-3 py-2 bg-cream rounded-xl">
                <div className="w-7 h-7 rounded-full bg-brown-200 flex items-center justify-center text-brown-700 text-xs font-medium">
                  {i + 1}
                </div>
                <span className="text-brown-900 text-sm">{player.nickname}</span>
              </div>
            ))}
            {Array.from({ length: room.maxPlayers - room.players.length }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 bg-cream rounded-xl opacity-40">
                <div className="w-7 h-7 rounded-full border border-brown-200 flex items-center justify-center text-brown-300 text-xs">
                  {room.players.length + i + 1}
                </div>
                <span className="text-brown-400 text-sm">대기 중...</span>
              </div>
            ))}
          </div>

          {room.status === 'playing' ? (
            <div className="text-center text-brown-600 text-sm py-2">게임이 시작되었습니다!</div>
          ) : (
            <button
              onClick={startGame}
              disabled={room.players.length < game.minPlayers}
              className="w-full py-2.5 rounded-xl bg-brown-900 text-brown-50 text-sm font-medium hover:bg-brown-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              게임 시작 ({game.minPlayers}인 이상 필요)
            </button>
          )}
        </div>

        <button
          onClick={() => {
            startGame()
            navigate(`/play/${game.id}/online`)
          }}
          className="text-brown-600 hover:text-brown-900 text-sm transition-colors"
        >
          ← 목록으로
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">

      <button
        onClick={() => navigate('/')}
        className="text-brown-600 hover:text-brown-900 text-sm mb-8 flex items-center gap-1 transition-colors"
      >
        ← 목록으로
      </button>

      <h1 className="text-3xl font-medium text-brown-900 mb-1">{game.titleKo}</h1>
      <p className="text-brown-600 text-sm mb-8">{game.description}</p>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">

        <div className="bg-ivory border border-brown-100 rounded-2xl p-6">
          <h2 className="text-brown-900 font-medium mb-1">혼자 플레이</h2>
          <p className="text-brown-600 text-sm mb-4">컴퓨터와 대전하거나 혼자 연습합니다.</p>
          <button
            onClick={() => navigate(`/play/${game.id}/local`)}
            className="w-full py-2.5 rounded-xl bg-brown-900 text-brown-50 text-sm font-medium hover:bg-brown-700 transition-colors"
          >
            싱글 플레이 시작
          </button>
        </div>

        <div className="bg-ivory border border-brown-100 rounded-2xl p-6">
          <h2 className="text-brown-900 font-medium mb-4">온라인 멀티플레이</h2>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-brown-700 text-sm font-medium">닉네임</label>
            <input
              type="text"
              placeholder="닉네임 입력"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-brown-200 bg-cream text-brown-900 text-sm placeholder:text-brown-300 focus:outline-none focus:border-brown-600"
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => createRoom(game.id as GameId, game.maxPlayers, nickname)}
              disabled={!nickname.trim() || loading}
              className="w-full py-2.5 rounded-xl bg-brown-700 text-brown-50 text-sm font-medium hover:bg-brown-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? '처리 중...' : '방 만들기'}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-brown-100" />
              <span className="text-brown-400 text-xs">또는</span>
              <div className="flex-1 h-px bg-brown-100" />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="6자리 코드 입력"
                maxLength={6}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-2.5 rounded-xl border border-brown-200 bg-cream text-brown-900 text-sm placeholder:text-brown-300 focus:outline-none focus:border-brown-600 uppercase tracking-widest"
              />
              <button
                onClick={() => enterRoom(roomCode, nickname)}
                disabled={!nickname.trim() || roomCode.length !== 6 || loading}
                className="px-4 py-2.5 rounded-xl bg-brown-700 text-brown-50 text-sm font-medium hover:bg-brown-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                입장
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}