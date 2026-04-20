import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  initGame, playCard, acceptPenalty, drawOne, passExtraTurn,
  pickSuit, canPlay, type GameState, type Suit,
} from './OnecardGame'
import { SUIT_SYMBOL, SUIT_COLOR } from './OnecardGame'
import CardComponent, { CardBack } from './CardComponent'

const SUITS: Suit[] = ['spade', 'heart', 'diamond', 'club']

interface SetupProps {
  onStart: (count: number, names: string[]) => void
}

function Setup({ onStart }: SetupProps) {
  const navigate = useNavigate()
  const [count, setCount] = useState(2)
  const [names, setNames] = useState([
    '플레이어 1','플레이어 2','플레이어 3','플레이어 4',
    '플레이어 5','플레이어 6','플레이어 7',
  ])

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <button onClick={() => navigate('/')} className="text-brown-600 hover:text-brown-900 text-sm mb-8 flex items-center gap-1 transition-colors">
        ← 목록으로
      </button>
      <h1 className="text-2xl font-medium text-brown-900 mb-8">원카드</h1>
      <div className="bg-ivory border border-brown-100 rounded-2xl p-6 flex flex-col gap-4">
        <div>
          <p className="text-brown-700 font-medium mb-3">플레이어 수</p>
          <div className="flex gap-2 flex-wrap">
            {[2,3,4,5,6,7].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`w-10 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  count === n
                    ? 'bg-brown-900 text-brown-50 border-brown-900'
                    : 'border-brown-200 text-brown-700 hover:bg-brown-50'
                }`}
              >
                {n}
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
          onClick={() => onStart(count, names.slice(0, count))}
          className="w-full py-2.5 rounded-xl bg-brown-900 text-brown-50 text-sm font-medium hover:bg-brown-700 transition-colors"
        >
          게임 시작
        </button>
      </div>
    </div>
  )
}

export default function OnecardPage() {
  const navigate = useNavigate()
  const [state, setState] = useState<GameState | null>(null)
  const [playerNames, setPlayerNames] = useState<string[]>([])
  const [selectedCard, setSelectedCard] = useState<number | null>(null)

  if (!state) {
    return (
      <Setup onStart={(count, names) => {
        setState(initGame(count))
        setPlayerNames(names)
      }} />
    )
  }

  const { currentIdx, discard, hands, winner, pendingDraw, wildSuit, extraTurn, mustPickSuit } = state
  const topCard = discard[discard.length - 1]
  const currentHand = hands[currentIdx]

  function handleCardClick(idx: number) {
    if (winner || mustPickSuit) return
    const card = currentHand[idx]
    if (!canPlay(card, topCard, wildSuit, pendingDraw)) return

    if (card.rank === '7') {
      // 7은 먼저 카드 내고 무늬 선택
      setState(playCard(state, idx))
      setSelectedCard(null)
      return
    }

    setState(playCard(state, idx))
    setSelectedCard(null)
  }

  function handleWildPick(suit: Suit) {
    setState(pickSuit(state, suit))
  }

  function handleDraw() {
    if (winner || mustPickSuit) return
    if (pendingDraw > 0) {
      setState(acceptPenalty(state))
    } else if (extraTurn) {
      setState(passExtraTurn(state))
    } else {
      setState(drawOne(state))
    }
    setSelectedCard(null)
  }

  function handleReset() {
    setState(null)
    setSelectedCard(null)
  }

  // 7 낸 후 무늬 선택 처리 — playCard에서 mustPickSuit=true로 설정됨
  // mustPickSuit일 때는 suit picker만 보여줌
  const effectiveSuit = wildSuit ?? topCard.suit

  const hasPlayable = !mustPickSuit && currentHand.some(
    (card) => card.rank !== 'JOKER' && canPlay(card, topCard, wildSuit, pendingDraw)
  )
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/')} className="text-brown-600 hover:text-brown-900 text-sm transition-colors">
          ← 목록으로
        </button>
        <h1 className="text-xl font-medium text-brown-900">원카드</h1>
        <button onClick={handleReset} className="text-sm px-3 py-1.5 rounded-lg border border-brown-200 text-brown-700 hover:bg-brown-50 transition-colors">
          다시 시작
        </button>
      </div>

      {winner !== null && (
        <div className="mb-6 px-6 py-4 rounded-2xl bg-brown-900 text-brown-50 text-center">
          <p className="text-lg font-medium">{playerNames[winner]} 승리! 🎉</p>
        </div>
      )}

      {/* 다른 플레이어 손패 */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {hands.map((hand, i) => {
          if (i === currentIdx) return null
          return (
            <div key={i} className="flex flex-col items-center gap-2 px-4 py-3 rounded-2xl border border-brown-100 bg-ivory">
              <span className="text-brown-700 text-xs font-medium">{playerNames[i]} ({hand.length}장)</span>
              <div className="flex gap-1">
                {hand.slice(0, 5).map((_, ci) => <CardBack key={ci} small />)}
                {hand.length > 5 && <span className="text-brown-400 text-xs self-center ml-1">+{hand.length - 5}</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* 중앙 — 덱과 버린 카드 */}
      <div className="flex items-center justify-center gap-8 mb-4">
        <div className="flex flex-col items-center gap-1">
          <CardBack />
          <span className="text-brown-400 text-xs">{state.deck.length}장</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <CardComponent card={topCard} />
          {wildSuit && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brown-100" style={{ color: SUIT_COLOR[wildSuit] }}>
              {SUIT_SYMBOL[wildSuit]} 지정됨
            </span>
          )}
        </div>
      </div>

      {/* 상태 메시지 */}
      {!winner && (
        <div className="text-center mb-3 flex items-center justify-center gap-2">
          <span className="text-brown-900 font-medium">{playerNames[currentIdx]}</span>
          <span className="text-brown-500 text-sm">
            {mustPickSuit ? '— 무늬를 선택하세요' : extraTurn ? '— 한 장 더 내세요' : '— 차례'}
          </span>
          {pendingDraw > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
              +{pendingDraw} 패널티 누적
            </span>
          )}
        </div>
      )}

      {/* 7 무늬 선택 */}
      {mustPickSuit && (
        <div className="flex justify-center gap-3 mb-4">
          {SUITS.map((suit) => (
            <button
              key={suit}
              onClick={() => handleWildPick(suit)}
              className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl transition-all hover:scale-105 ${
                effectiveSuit === suit ? 'border-brown-600 bg-brown-100' : 'border-brown-200 bg-ivory'
              }`}
              style={{ color: SUIT_COLOR[suit] }}
            >
              {SUIT_SYMBOL[suit]}
            </button>
          ))}
        </div>
      )}

      {/* 현재 플레이어 손패 */}
      {!winner && !mustPickSuit && (
        <div className="flex flex-wrap gap-2 justify-center mb-4 min-h-24">
          {currentHand.map((card, i) => {
            const playable = canPlay(card, topCard, wildSuit, pendingDraw)
            return (
              <CardComponent
                key={card.id}
                card={card}
                onClick={() => handleCardClick(i)}
                selected={selectedCard === i}
                disabled={!playable}
              />
            )
          })}
        </div>
      )}

      {/* 카드 뽑기 / 패스 버튼 */}
      {!winner && !mustPickSuit && (
        <div className="flex justify-center">
          <button
            onClick={handleDraw}
            disabled={hasPlayable}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              hasPlayable
                ? 'bg-brown-200 text-brown-400 cursor-not-allowed'
                : 'bg-brown-900 text-brown-50 hover:bg-brown-700'
            }`}
          >
            {pendingDraw > 0
              ? `패널티 카드 ${pendingDraw}장 받기`
              : extraTurn
              ? '패스 (카드 1장 받기)'
              : '카드 뽑기'}
          </button>
        </div>
      )}
    </div>
  )
}