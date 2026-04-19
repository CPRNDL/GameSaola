import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  rollDice, calcScore, totalScore, isGameOver, createPlayerState,
  ALL_CATEGORIES, CATEGORY_LABELS,
  type DiceValues, type PlayerState, type ScoreCategory,
} from './YachtGame'

const DICE_FACES = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

interface SetupProps {
  onStart: (players: PlayerState[]) => void
}

function Setup({ onStart }: SetupProps) {
  const navigate = useNavigate()
  const [count, setCount] = useState(2)
  const [names, setNames] = useState(['플레이어 1', '플레이어 2', '플레이어 3', '플레이어 4'])

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <button onClick={() => navigate('/')} className="text-brown-600 hover:text-brown-900 text-sm mb-8 flex items-center gap-1 transition-colors">
        ← 목록으로
      </button>
      <h1 className="text-2xl font-medium text-brown-900 mb-8">요트</h1>
      <div className="bg-ivory border border-brown-100 rounded-2xl p-6 flex flex-col gap-4">
        <div>
          <p className="text-brown-700 font-medium mb-3">플레이어 수</p>
          <div className="flex gap-2">
            {[1,2,3,4].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  count === n
                    ? 'bg-brown-900 text-brown-50 border-brown-900'
                    : 'border-brown-200 text-brown-700 hover:bg-brown-50'
                }`}
              >
                {n}인
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {Array.from({ length: count }).map((_, i) => (
            <input
              key={i}
              value={names[i]}
              onChange={(e) => {
                const next = [...names]
                next[i] = e.target.value
                setNames(next)
              }}
              className="px-3 py-2.5 rounded-xl border border-brown-200 bg-cream text-brown-900 text-sm focus:outline-none focus:border-brown-600"
            />
          ))}
        </div>
        <button
          onClick={() => onStart(Array.from({ length: count }, (_, i) => createPlayerState(names[i])))}
          className="w-full py-2.5 rounded-xl bg-brown-900 text-brown-50 text-sm font-medium hover:bg-brown-700 transition-colors"
        >
          게임 시작
        </button>
      </div>
    </div>
  )
}

export default function YachtPage() {
  const navigate = useNavigate()
  const [players, setPlayers] = useState<PlayerState[] | null>(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [dice, setDice] = useState<DiceValues>([1,1,1,1,1])
  const [kept, setKept] = useState<boolean[]>([false,false,false,false,false])
  const [rollsLeft, setRollsLeft] = useState(3)
  const [rolled, setRolled] = useState(false)

  if (!players) return <Setup onStart={(p) => setPlayers(p)} />

  const currentPlayer = players[currentIdx]
  const gameOver = isGameOver(players)

  function handleRoll() {
    if (rollsLeft === 0) return
    const next = rollDice(kept, dice)
    setDice(next)
    setRollsLeft((r) => r - 1)
    setRolled(true)
  }

  function toggleKept(i: number) {
    if (!rolled) return
    setKept((prev) => prev.map((k, idx) => idx === i ? !k : k))
  }

  function handleScore(category: ScoreCategory) {
    if (!rolled) return
    if (currentPlayer.scoreCard[category] !== undefined) return

    const score = calcScore(category, dice)
    const nextPlayers = players.map((p, i) => {
      if (i !== currentIdx) return p
      return { ...p, scoreCard: { ...p.scoreCard, [category]: score } }
    })
    setPlayers(nextPlayers)

    const nextIdx = (currentIdx + 1) % players.length
    setCurrentIdx(nextIdx)
    setDice([1,1,1,1,1])
    setKept([false,false,false,false,false])
    setRollsLeft(3)
    setRolled(false)
  }

  const winner = gameOver
    ? [...players].sort((a, b) => totalScore(b.scoreCard) - totalScore(a.scoreCard))[0]
    : null

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/')} className="text-brown-600 hover:text-brown-900 text-sm transition-colors">
          ← 목록으로
        </button>
        <h1 className="text-xl font-medium text-brown-900">요트</h1>
        <button
          onClick={() => { setPlayers(null); setCurrentIdx(0) }}
          className="text-sm px-3 py-1.5 rounded-lg border border-brown-200 text-brown-700 hover:bg-brown-50 transition-colors"
        >
          다시 시작
        </button>
      </div>

      {gameOver && winner && (
        <div className="mb-6 px-6 py-4 rounded-2xl bg-brown-900 text-brown-50 text-center">
          <p className="text-lg font-medium">{winner.name} 승리! 🎉</p>
          <p className="text-brown-300 text-sm mt-1">{totalScore(winner.scoreCard)}점</p>
        </div>
      )}

      {!gameOver && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-brown-900 font-medium">{currentPlayer.name}</span>
            <span className="text-brown-400 text-sm">주사위 굴리기 {rollsLeft}회 남음</span>
          </div>

          <div className="flex gap-3 mb-4">
            {dice.map((d, i) => (
              <button
                key={i}
                onClick={() => toggleKept(i)}
                className={`w-16 h-16 rounded-xl text-4xl flex items-center justify-center border-2 transition-all ${
                  kept[i]
                    ? 'border-brown-600 bg-brown-100 scale-95'
                    : 'border-brown-200 bg-ivory hover:border-brown-400'
                }`}
              >
                {DICE_FACES[d]}
              </button>
            ))}
          </div>

          <button
            onClick={handleRoll}
            disabled={rollsLeft === 0}
            className="px-6 py-2.5 rounded-xl bg-brown-900 text-brown-50 text-sm font-medium hover:bg-brown-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {rolled ? '다시 굴리기' : '굴리기'}
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left text-brown-600 font-medium py-2 pr-4 min-w-32">카테고리</th>
              {players.map((p, i) => (
                <th key={i} className={`text-center py-2 px-3 min-w-24 ${i === currentIdx && !gameOver ? 'text-brown-900' : 'text-brown-500'}`}>
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_CATEGORIES.map((cat) => (
              <tr key={cat} className="border-t border-brown-100">
                <td className="py-2 pr-4 text-brown-700">{CATEGORY_LABELS[cat]}</td>
                {players.map((p, i) => {
                  const scored = p.scoreCard[cat]
                  const preview = i === currentIdx && rolled && scored === undefined
                    ? calcScore(cat, dice)
                    : null

                  return (
                    <td key={i} className="text-center py-2 px-3">
                      {scored !== undefined ? (
                        <span className="text-brown-900 font-medium">{scored}</span>
                      ) : i === currentIdx && !gameOver && rolled ? (
                        <button
                          onClick={() => handleScore(cat)}
                          className="w-full py-1 rounded-lg bg-brown-50 hover:bg-brown-200 text-brown-600 transition-colors"
                        >
                          {preview}
                        </button>
                      ) : (
                        <span className="text-brown-300">-</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
            <tr className="border-t-2 border-brown-300">
              <td className="py-2 pr-4 text-brown-900 font-medium">합계</td>
              {players.map((p, i) => (
                <td key={i} className="text-center py-2 px-3 text-brown-900 font-medium">
                  {totalScore(p.scoreCard)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}