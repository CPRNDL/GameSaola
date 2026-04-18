import { useState, useCallback } from 'react'
import { Chess, type Square, type PieceSymbol, type Color } from 'chess.js'
import { useNavigate } from 'react-router-dom'

const PIECE_UNICODE: Record<Color, Record<PieceSymbol, string>> = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1']

export default function ChessPage() {
  const navigate = useNavigate()
  const [game, setGame] = useState(new Chess())
  const [selected, setSelected] = useState<Square | null>(null)
  const [legalMoves, setLegalMoves] = useState<Square[]>([])
  const [promotion, setPromotion] = useState<{ from: Square; to: Square } | null>(null)
  const [lastMove, setLastMove] = useState<[Square, Square] | null>(null)

  const status = () => {
    if (game.isCheckmate()) return `체크메이트! ${game.turn() === 'w' ? '흑' : '백'} 승리!`
    if (game.isDraw()) return '무승부!'
    if (game.isStalemate()) return '스테일메이트!'
    if (game.isCheck()) return `${game.turn() === 'w' ? '백' : '흑'} 체크!`
    return `${game.turn() === 'w' ? '백' : '흑'} 차례`
  }

  const isGameOver = game.isGameOver()

  function handleSquareClick(square: Square) {
    if (isGameOver) return

    if (selected) {
      if (legalMoves.includes(square)) {
        const piece = game.get(selected)
        const isPromotion =
          piece?.type === 'p' &&
          ((piece.color === 'w' && square[1] === '8') ||
           (piece.color === 'b' && square[1] === '1'))

        if (isPromotion) {
          setPromotion({ from: selected, to: square })
          setSelected(null)
          setLegalMoves([])
          return
        }

        makeMove(selected, square)
      } else {
        selectSquare(square)
      }
    } else {
      selectSquare(square)
    }
  }

  function selectSquare(square: Square) {
    const piece = game.get(square)
    if (!piece || piece.color !== game.turn()) {
      setSelected(null)
      setLegalMoves([])
      return
    }
    setSelected(square)
    const moves = game.moves({ square, verbose: true }).map((m) => m.to as Square)
    setLegalMoves(moves)
  }

  const makeMove = useCallback((from: Square, to: Square, promotionPiece?: PieceSymbol) => {
    const newGame = new Chess(game.fen())
    try {
      newGame.move({ from, to, promotion: promotionPiece ?? 'q' })
      setGame(newGame)
      setLastMove([from, to])
    } catch {
      // 잘못된 수
    }
    setSelected(null)
    setLegalMoves([])
    setPromotion(null)
  }, [game])

  function handleReset() {
    setGame(new Chess())
    setSelected(null)
    setLegalMoves([])
    setLastMove(null)
    setPromotion(null)
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/')} className="text-brown-600 hover:text-brown-900 text-sm transition-colors">
          ← 목록으로
        </button>
        <h1 className="text-xl font-medium text-brown-900">체스</h1>
        <button onClick={handleReset} className="text-sm px-3 py-1.5 rounded-lg border border-brown-200 text-brown-700 hover:bg-brown-50 transition-colors">
          다시 시작
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className={`px-6 py-2 rounded-full text-sm font-medium ${
          isGameOver
            ? 'bg-brown-900 text-brown-50'
            : game.isCheck()
            ? 'bg-red-100 text-red-700 border border-red-200'
            : 'bg-ivory border border-brown-200 text-brown-700'
        }`}>
          {status()}
        </div>

        <div className="flex gap-2">
          <div className="flex flex-col justify-between py-1 mr-1">
            {RANKS.map((rank) => (
              <span key={rank} className="text-xs text-brown-400 h-14 flex items-center">{rank}</span>
            ))}
          </div>

          <div>
            <div className="border border-brown-300 rounded overflow-hidden">
              {RANKS.map((rank) => (
                <div key={rank} className="flex">
                  {FILES.map((file) => {
                    const square = `${file}${rank}` as Square
                    const piece = game.get(square)
                    const isLight = (FILES.indexOf(file) + RANKS.indexOf(rank)) % 2 === 0
                    const isSelected = selected === square
                    const isLegal = legalMoves.includes(square)
                    const isLast = lastMove && (lastMove[0] === square || lastMove[1] === square)

                    return (
                      <div
                        key={square}
                        onClick={() => handleSquareClick(square)}
                        className="w-14 h-14 flex items-center justify-center cursor-pointer relative select-none"
                        style={{
                          background: isSelected
                            ? '#aed481'
                            : isLast
                            ? (isLight ? '#f6f669' : '#baca2b')
                            : isLight
                            ? '#f0d9b5'
                            : '#b58863',
                        }}
                      >
                        {isLegal && (
                          <div
                            className="absolute rounded-full pointer-events-none"
                            style={{
                              width: piece ? '100%' : '30%',
                              height: piece ? '100%' : '30%',
                              background: piece
                                ? 'rgba(0,0,0,0.15)'
                                : 'rgba(0,0,0,0.2)',
                              border: piece ? '4px solid rgba(0,0,0,0.15)' : 'none',
                            }}
                          />
                        )}
                        {piece && (
                          <span
                            style={{
                              fontSize: 36,
                              lineHeight: 1,
                              color: piece.color === 'w' ? '#fff' : '#000',
                              textShadow: piece.color === 'w'
                                ? '0 0 2px #000, 0 0 2px #000'
                                : '0 0 2px rgba(255,255,255,0.3)',
                              userSelect: 'none',
                            }}
                          >
                            {PIECE_UNICODE[piece.color][piece.type]}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            <div className="flex mt-1">
              {FILES.map((file) => (
                <span key={file} className="text-xs text-brown-400 w-14 text-center">{file}</span>
              ))}
            </div>
          </div>
        </div>

        {/* 프로모션 선택 모달 */}
        {promotion && (
          <div style={{ minHeight: 200, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 16, padding: 24, width: '100%' }}>
            <div className="bg-ivory rounded-2xl p-6 flex flex-col items-center gap-4">
              <p className="text-brown-900 font-medium">프로모션 선택</p>
              <div className="flex gap-3">
                {(['q', 'r', 'b', 'n'] as PieceSymbol[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => makeMove(promotion.from, promotion.to, p)}
                    className="w-14 h-14 rounded-xl border border-brown-200 hover:bg-brown-50 flex items-center justify-center text-3xl transition-colors"
                  >
                    {PIECE_UNICODE[game.turn()][p]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}