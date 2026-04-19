import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createBoard, getLegalMoves, applyMove, checkWinner,
  type Board, type Player, type Move, type Position
} from './CheckerGame'
import CheckerBoard from './CheckerBoard'

export default function CheckerPage() {
  const navigate = useNavigate()
  const [board, setBoard] = useState<Board>(createBoard())
  const [currentPlayer, setCurrentPlayer] = useState<Player>('red')
  const [selectedFrom, setSelectedFrom] = useState<Position | null>(null)
  const [lastMove, setLastMove] = useState<Move | null>(null)
  const [winner, setWinner] = useState<Player | null>(null)

  const legalMoves = winner ? [] : getLegalMoves(board, currentPlayer)

  function handleSelect(pos: Position) {
    if (winner) return
    const piece = board[pos.row][pos.col]

    if (selectedFrom) {
      const move = legalMoves.find(
        (m) =>
          m.from.row === selectedFrom.row &&
          m.from.col === selectedFrom.col &&
          m.to.row === pos.row &&
          m.to.col === pos.col
      )

      if (move) {
        const next = applyMove(board, move)
        setBoard(next)
        setLastMove(move)
        setSelectedFrom(null)

        const w = checkWinner(next, currentPlayer)
        if (w) {
          setWinner(w)
          return
        }
        setCurrentPlayer((p) => p === 'red' ? 'black' : 'red')
        return
      }
    }

    if (piece?.player === currentPlayer) {
      const hasMoves = legalMoves.some((m) => m.from.row === pos.row && m.from.col === pos.col)
      if (hasMoves) {
        setSelectedFrom(pos)
        return
      }
    }

    setSelectedFrom(null)
  }

  function handleReset() {
    setBoard(createBoard())
    setCurrentPlayer('red')
    setSelectedFrom(null)
    setLastMove(null)
    setWinner(null)
  }

  const statusText = () => {
    if (winner) return `${winner === 'red' ? '빨강' : '검정'} 승리!`
    return `${currentPlayer === 'red' ? '빨강' : '검정'} 차례`
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/')} className="text-brown-600 hover:text-brown-900 text-sm transition-colors">
          ← 목록으로
        </button>
        <h1 className="text-xl font-medium text-brown-900">체커</h1>
        <button onClick={handleReset} className="text-sm px-3 py-1.5 rounded-lg border border-brown-200 text-brown-700 hover:bg-brown-50 transition-colors">
          다시 시작
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className={`px-6 py-2 rounded-full text-sm font-medium ${
          winner
            ? 'bg-brown-900 text-brown-50'
            : 'bg-ivory border border-brown-200 text-brown-700'
        }`}>
          {statusText()}
        </div>

        <CheckerBoard
          board={board}
          legalMoves={legalMoves}
          selectedFrom={selectedFrom}
          onSelect={handleSelect}
          lastMove={lastMove}
        />

        <p className="text-brown-400 text-xs">점프 가능한 경우 반드시 점프해야 합니다</p>
      </div>
    </div>
  )
}