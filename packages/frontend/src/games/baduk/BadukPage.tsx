import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBoard, applyMove, calculateScore, type Board, type Cell } from './BadukGame'
import BadukBoard from './BadukBoard'

const KOMI = 6.5

export default function BadukPage() {
  const navigate = useNavigate()
  const [size, setSize] = useState<number>(13)
  const [board, setBoard] = useState<Board>(createBoard(13))
  const [currentPlayer, setCurrentPlayer] = useState<Cell>('black')
  const [prevBoardJson, setPrevBoardJson] = useState<string | null>(null)
  const [lastMove, setLastMove] = useState<[number, number] | null>(null)
  const [capturedBlack, setCapturedBlack] = useState(0)
  const [capturedWhite, setCapturedWhite] = useState(0)
  const [passCount, setPassCount] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState<{ black: number; white: number } | null>(null)
  const [started, setStarted] = useState(false)

  function handleSizeChange(s: number) {
    setSize(s)
    setBoard(createBoard(s))
    setCurrentPlayer('black')
    setPrevBoardJson(null)
    setLastMove(null)
    setCapturedBlack(0)
    setCapturedWhite(0)
    setPassCount(0)
    setGameOver(false)
    setScore(null)
  }

  function handlePlace(row: number, col: number) {
    if (gameOver) return
    const result = applyMove(board, row, col, currentPlayer, size, prevBoardJson)
    if (!result) return

    const { nextBoard, captured } = result
    setPrevBoardJson(JSON.stringify(board))
    setBoard(nextBoard)
    setLastMove([row, col])
    setPassCount(0)

    if (currentPlayer === 'black') setCapturedWhite((p) => p + captured)
    else setCapturedBlack((p) => p + captured)

    setCurrentPlayer((p) => p === 'black' ? 'white' : 'black')
  }

  function handlePass() {
    if (gameOver) return
    if (passCount + 1 >= 2) {
      const s = calculateScore(board, size, capturedBlack, capturedWhite, KOMI)
      setScore(s)
      setGameOver(true)
    } else {
      setPassCount((p) => p + 1)
      setCurrentPlayer((p) => p === 'black' ? 'white' : 'black')
    }
  }

  function handleReset() {
    handleSizeChange(size)
    setStarted(false)
  }

  if (!started) {
    return (
      <div className="max-w-md mx-auto px-6 py-16">
        <button onClick={() => navigate('/')} className="text-brown-600 hover:text-brown-900 text-sm mb-8 flex items-center gap-1 transition-colors">
          ← 목록으로
        </button>
        <h1 className="text-2xl font-medium text-brown-900 mb-8">바둑</h1>

        <div className="bg-ivory border border-brown-100 rounded-2xl p-6">
          <p className="text-brown-700 font-medium mb-4">보드 크기 선택</p>
          <div className="flex flex-col gap-3">
            {[13, 19].map((s) => (
              <button
                key={s}
                onClick={() => { handleSizeChange(s); setStarted(true) }}
                className="w-full py-3 rounded-xl border border-brown-200 text-brown-700 hover:bg-brown-50 hover:border-brown-400 transition-colors text-sm font-medium"
              >
                {s}×{s} {s === 13 ? '(입문용)' : '(정식)'}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/')} className="text-brown-600 hover:text-brown-900 text-sm transition-colors">
          ← 목록으로
        </button>
        <h1 className="text-xl font-medium text-brown-900">바둑 {size}×{size}</h1>
        <button onClick={handleReset} className="text-sm px-3 py-1.5 rounded-lg border border-brown-200 text-brown-700 hover:bg-brown-50 transition-colors">
          다시 시작
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
        <BadukBoard board={board} size={size} onPlace={handlePlace} disabled={gameOver} lastMove={lastMove} />

        <div className="flex flex-col gap-4 min-w-48">
          {gameOver && score ? (
            <div className="bg-ivory border border-brown-100 rounded-2xl p-4">
              <p className="text-brown-900 font-medium mb-3">게임 종료</p>
              <div className="flex flex-col gap-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-brown-600">흑</span>
                  <span className="text-brown-900 font-medium">{score.black}집</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brown-600">백 (덤 {KOMI})</span>
                  <span className="text-brown-900 font-medium">{score.white}집</span>
                </div>
              </div>
              <p className="text-brown-900 font-medium text-center">
                {score.black > score.white ? '흑 승리!' : '백 승리!'}
              </p>
            </div>
          ) : (
            <div className="bg-ivory border border-brown-100 rounded-2xl p-4">
              <p className="text-brown-600 text-sm mb-1">현재 차례</p>
              <p className="text-brown-900 font-medium">{currentPlayer === 'black' ? '흑' : '백'}</p>
            </div>
          )}

          <div className="bg-ivory border border-brown-100 rounded-2xl p-4 text-sm">
            <p className="text-brown-600 mb-2">따낸 돌</p>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-brown-700">흑이 따냄</span>
                <span className="text-brown-900 font-medium">{capturedWhite}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brown-700">백이 따냄</span>
                <span className="text-brown-900 font-medium">{capturedBlack}</span>
              </div>
            </div>
          </div>

          {!gameOver && (
            <button
              onClick={handlePass}
              className="w-full py-2.5 rounded-xl border border-brown-200 text-brown-700 text-sm font-medium hover:bg-brown-50 transition-colors"
            >
              패스 {passCount > 0 ? '(1/2)' : ''}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}