import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createBoard, getLegalMoves, applyMove,
  isInCheck, isCheckmate,
  type Board, type Player, type Position
} from './JanggiGame'
import JanggiBoard from './JanggiBoard'

export default function JanggiPage() {
  const navigate = useNavigate()
  const [board, setBoard] = useState<Board>(createBoard())
  const [currentPlayer, setCurrentPlayer] = useState<Player>('cho')
  const [selected, setSelected] = useState<Position | null>(null)
  const [legalMoves, setLegalMoves] = useState<Position[]>([])
  const [lastMove, setLastMove] = useState<[Position, Position] | null>(null)
  const [winner, setWinner] = useState<Player | null>(null)

  const inCheck = isInCheck(board, currentPlayer)

  function handleSelect(pos: Position) {
    if (winner) return
    const piece = board[pos.row][pos.col]

    if (selected) {
      const isLegal = legalMoves.some((m) => m.row === pos.row && m.col === pos.col)
      if (isLegal) {
        const next = applyMove(board, selected, pos)
        if (isInCheck(next, currentPlayer)) return 

        setBoard(next)
        setLastMove([selected, pos])
        setSelected(null)
        setLegalMoves([])

        const nextOpponent: Player = currentPlayer === 'cho' ? 'han' : 'cho'
        if (isCheckmate(next, nextOpponent)) {
          setWinner(currentPlayer)
          return
        }
        setCurrentPlayer(nextOpponent)
        return
      }
    }

    if (piece?.player === currentPlayer) {
      const moves = getLegalMoves(board, pos.row, pos.col).filter((m) => {
        const next = applyMove(board, pos, m)
        return !isInCheck(next, currentPlayer)
      })
      setSelected(pos)
      setLegalMoves(moves)
    } else {
      setSelected(null)
      setLegalMoves([])
    }
  }

  function handleReset() {
    setBoard(createBoard())
    setCurrentPlayer('cho')
    setSelected(null)
    setLegalMoves([])
    setLastMove(null)
    setWinner(null)
  }

  const statusText = () => {
    if (winner) return `${winner === 'cho' ? '초' : '한'} 승리!`
    if (inCheck) return `${currentPlayer === 'cho' ? '초' : '한'} 장군!`
    return `${currentPlayer === 'cho' ? '초(아래)' : '한(위)'} 차례`
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/')} className="text-brown-600 hover:text-brown-900 text-sm transition-colors">
          ← 목록으로
        </button>
        <h1 className="text-xl font-medium text-brown-900">장기</h1>
        <button onClick={handleReset} className="text-sm px-3 py-1.5 rounded-lg border border-brown-200 text-brown-700 hover:bg-brown-50 transition-colors">
          다시 시작
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className={`px-6 py-2 rounded-full text-sm font-medium ${
          winner
            ? 'bg-brown-900 text-brown-50'
            : inCheck
            ? 'bg-red-100 text-red-700 border border-red-200'
            : 'bg-ivory border border-brown-200 text-brown-700'
        }`}>
          {statusText()}
        </div>

        <JanggiBoard
          board={board}
          selected={selected}
          legalMoves={legalMoves}
          lastMove={lastMove}
          onSelect={handleSelect}
        />
      </div>
    </div>
  )
}