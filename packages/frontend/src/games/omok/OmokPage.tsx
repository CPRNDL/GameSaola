import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBoard, checkWinner, isBoardFull, type Board, type Cell } from './OmokGame'
import OmokBoard from './OmokBoard'
import { useRoom } from '../../hooks/useRoom'
import { useSocket } from '../../hooks/useSocket'
import { SOCKET_EVENTS } from '@gamesaola/shared'

interface OmokPageProps {
  mode: 'local' | 'online'
}

export default function OmokPage({ mode }: OmokPageProps) {
  const navigate = useNavigate()
  const { room } = useRoom()
  const socket = useSocket()

  const [board, setBoard] = useState<Board>(createBoard())
  const [currentPlayer, setCurrentPlayer] = useState<Cell>('black')
  const [winner, setWinner] = useState<Cell | 'draw' | null>(null)
  const [lastMove, setLastMove] = useState<[number, number] | null>(null)

  const myColor: Cell = mode === 'online'
    ? room?.players[0]?.id === socket.id ? 'black' : 'white'
    : currentPlayer

  const isMyTurn = mode === 'local' || currentPlayer === myColor

  useEffect(() => {
    if (mode !== 'online') return

    socket.on(SOCKET_EVENTS.PLAYER_MOVE, (data: { row: number; col: number; player: Cell }) => {
      setBoard((prev) => {
        const next = prev.map((r) => [...r])
        next[data.row][data.col] = data.player
        return next
      })
      setLastMove([data.row, data.col])
      if (checkWinner(board, data.row, data.col, data.player)) {
        setWinner(data.player)
      } else {
        setCurrentPlayer((p) => p === 'black' ? 'white' : 'black')
      }
    })

    return () => { socket.off(SOCKET_EVENTS.PLAYER_MOVE) }
  }, [socket, mode, board])

  function handlePlace(row: number, col: number) {
    if (winner || board[row][col] || !isMyTurn) return

    const next = board.map((r) => [...r])
    next[row][col] = currentPlayer

    setBoard(next)
    setLastMove([row, col])

    if (checkWinner(next, row, col, currentPlayer)) {
      setWinner(currentPlayer)
    } else if (isBoardFull(next)) {
      setWinner('draw')
    } else {
      setCurrentPlayer((p) => p === 'black' ? 'white' : 'black')
    }

    if (mode === 'online') {
      socket.emit(SOCKET_EVENTS.PLAYER_MOVE, { row, col, player: currentPlayer })
    }
  }

  function handleReset() {
    setBoard(createBoard())
    setCurrentPlayer('black')
    setWinner(null)
    setLastMove(null)
  }

  const statusText = () => {
    if (winner === 'draw') return '무승부!'
    if (winner) return `${winner === 'black' ? '흑' : '백'} 승리!`
    if (mode === 'online' && !isMyTurn) return '상대방 차례'
    return `${currentPlayer === 'black' ? '흑' : '백'} 차례`
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-brown-600 hover:text-brown-900 text-sm transition-colors"
        >
          ← 목록으로
        </button>
        <h1 className="text-xl font-medium text-brown-900">오목</h1>
        <button
          onClick={handleReset}
          className="text-sm px-3 py-1.5 rounded-lg border border-brown-200 text-brown-700 hover:bg-brown-50 transition-colors"
        >
          다시 시작
        </button>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className={`px-6 py-2 rounded-full text-sm font-medium ${
          winner
            ? 'bg-brown-900 text-brown-50'
            : 'bg-ivory border border-brown-200 text-brown-700'
        }`}>
          {statusText()}
        </div>

        <OmokBoard
          board={board}
          onPlace={handlePlace}
          disabled={!!winner || !isMyTurn}
          lastMove={lastMove}
        />
      </div>
    </div>
  )
}