export type Suit = 'spade' | 'heart' | 'diamond' | 'club' | 'joker'
export type Rank =
  | 'A' | '2' | '3' | '4' | '5' | '6' | '7'
  | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'JOKER'

export interface Card {
  suit: Suit
  rank: Rank
  id: number
}

export const SUIT_SYMBOL: Record<Suit, string> = {
  spade: '♠', heart: '♥', diamond: '♦', club: '♣', joker: '★',
}

export const SUIT_COLOR: Record<Suit, string> = {
  spade: '#1a1a1a', heart: '#C0392B', diamond: '#C0392B', club: '#1a1a1a', joker: '#7B2FBE',
}

const RANKS: Rank[] = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']
const SUITS: Suit[] = ['spade', 'heart', 'diamond', 'club']

export function createDeck(): Card[] {
  let id = 0
  const deck: Card[] = []
  for (const suit of SUITS)
    for (const rank of RANKS)
      deck.push({ suit, rank, id: id++ })
  // 조커 2장
  deck.push({ suit: 'joker', rank: 'JOKER', id: id++ })
  deck.push({ suit: 'joker', rank: 'JOKER', id: id++ })
  return deck
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 카드를 낼 수 있는지 확인
export function canPlay(card: Card, top: Card, wildSuit: Suit | null, pendingDraw: number): boolean {
  if (pendingDraw > 0) {
    if (top.rank === 'JOKER') return false
    if (top.rank === 'A') return card.rank === 'A' || card.rank === 'JOKER'
    if (top.rank === '2') return card.rank === '2' || card.rank === 'JOKER'
    return false
  }
  if (card.rank === 'JOKER') return top.rank !== 'JOKER'
  if (top.rank === 'JOKER') return true
  if (wildSuit) {
    return card.suit === wildSuit || card.rank === top.rank
  }
  if (card.suit === top.suit) return true
  if (card.rank === top.rank) return true
  return false
}

export function pickSuit(state: GameState, chosenSuit: Suit): GameState {
  const nextIdx = (state.currentIdx + state.direction + state.playerCount) % state.playerCount
  return {
    ...state,
    wildSuit: chosenSuit,
    currentIdx: nextIdx,
    pendingDraw: 0,
    extraTurn: false,
    mustPickSuit: false,
  }
}

export type SpecialEffect =
  | { type: 'skip' }       // J: 건너뛰기
  | { type: 'reverse' }    // Q: 방향 바꾸기
  | { type: 'extra' }      // K: 한 장 더 내기
  | { type: 'wild7' }      // 7: 무늬 선택
  | { type: 'draw'; count: number }  // A(3), 2(2), JOKER(7)
  | null

export function getEffect(card: Card): SpecialEffect {
  switch (card.rank) {
    case 'A': return { type: 'draw', count: 3 }
    case '2': return { type: 'draw', count: 2 }
    case 'JOKER': return { type: 'draw', count: 7 }
    case 'J': return { type: 'skip' }
    case 'Q': return { type: 'reverse' }
    case 'K': return { type: 'extra' }
    case '7': return { type: 'wild7' }
    default: return null
  }
}

export interface GameState {
  deck: Card[]
  discard: Card[]
  hands: Card[][]
  currentIdx: number
  direction: 1 | -1
  pendingDraw: number      // 누적 패널티
  wildSuit: Suit | null    // 7로 지정한 무늬
  extraTurn: boolean       // K 효과: 한 장 더 내기
  winner: number | null
  playerCount: number
  mustPickSuit: boolean    // 7을 낸 후 무늬 선택 대기
}

export function initGame(playerCount: number): GameState {
  let deck = shuffle(createDeck())
  const hands: Card[][] = []

  const handSize =
    playerCount <= 3 ? 7 :
    playerCount <= 5 ? 6 : 5

  for (let i = 0; i < playerCount; i++)
    hands.push(deck.splice(0, handSize))

  while (['A','2','7','J','Q','K','JOKER'].includes(deck[0].rank))
    deck = shuffle(deck)

  const discard = [deck.splice(0, 1)[0]]

  return {
    deck, discard, hands,
    currentIdx: 0,
    direction: 1,
    pendingDraw: 0,
    wildSuit: null,
    extraTurn: false,
    winner: null,
    playerCount,
    mustPickSuit: false,
  }
}

function getNextIdx(state: GameState, skip = false): number {
  const { currentIdx, direction, playerCount } = state
  let next = (currentIdx + direction + playerCount) % playerCount
  if (skip) next = (next + direction + playerCount) % playerCount
  return next
}

export function replenishDeck(state: GameState): GameState {
  if (state.deck.length > 0) return state
  const top = state.discard[state.discard.length - 1]
  const deck = shuffle(state.discard.slice(0, -1))
  return { ...state, deck, discard: [top] }
}

export function drawCardsForPlayer(state: GameState, playerIdx: number, count: number): GameState {
  let s = replenishDeck(state)
  const hands = s.hands.map((h) => [...h])
  for (let i = 0; i < count; i++) {
    s = replenishDeck(s)
    if (s.deck.length === 0) break
    hands[playerIdx].push(s.deck.shift()!)
  }
  return { ...s, hands }
}

export function playCard(state: GameState, cardIdx: number, chosenSuit?: Suit): GameState {
  const hands = state.hands.map((h) => [...h])
  const [card] = hands[state.currentIdx].splice(cardIdx, 1)
  const discard = [...state.discard, card]
  const effect = getEffect(card)

  // 승리 체크
  if (hands[state.currentIdx].length === 0) {
    return { ...state, hands, discard, winner: state.currentIdx, wildSuit: null, mustPickSuit: false }
  }

  // 7: 무늬 선택 대기
  if (effect?.type === 'wild7') {
    return { ...state, hands, discard, mustPickSuit: true, extraTurn: false, wildSuit: null }
  }

  // A, 2, JOKER: 패널티 누적
  if (effect?.type === 'draw') {
    const pending = state.pendingDraw + effect.count
    const nextIdx = getNextIdx({ ...state, hands, discard })
    return { ...state, hands, discard, pendingDraw: pending, currentIdx: nextIdx, extraTurn: false, wildSuit: null, mustPickSuit: false }
  }

  // J: 건너뛰기
  if (effect?.type === 'skip') {
    const nextIdx = getNextIdx({ ...state, hands, discard }, true)
    return { ...state, hands, discard, currentIdx: nextIdx, pendingDraw: 0, extraTurn: false, wildSuit: null, mustPickSuit: false }
  }

  // Q: 방향 바꾸기
  if (effect?.type === 'reverse') {
    const dir = (state.direction * -1) as 1 | -1
    const nextIdx = getNextIdx({ ...state, hands, discard, direction: dir })
    return { ...state, hands, discard, direction: dir, currentIdx: nextIdx, pendingDraw: 0, extraTurn: false, wildSuit: null, mustPickSuit: false }
  }

  // K: 한 장 더 내기
  if (effect?.type === 'extra') {
    return { ...state, hands, discard, extraTurn: true, pendingDraw: 0, wildSuit: null, mustPickSuit: false }
  }

  // 일반 카드
  const nextIdx = getNextIdx({ ...state, hands, discard })
  return { ...state, hands, discard, currentIdx: nextIdx, pendingDraw: 0, extraTurn: false, wildSuit: null, mustPickSuit: false }
}

// K 효과 중 낼 카드 없어서 패스
export function passExtraTurn(state: GameState): GameState {
  let next = drawCardsForPlayer(state, state.currentIdx, 1)
  const nextIdx = getNextIdx(next)
  return { ...next, currentIdx: nextIdx, extraTurn: false, wildSuit: null }
}

// 패널티 카드 받기 (낼 A/2 없을 때)
export function acceptPenalty(state: GameState): GameState {
  let next = drawCardsForPlayer(state, state.currentIdx, state.pendingDraw)
  const nextIdx = getNextIdx(next)
  return { ...next, currentIdx: nextIdx, pendingDraw: 0, wildSuit: null, extraTurn: false }
}

// 일반 카드 뽑기
export function drawOne(state: GameState): GameState {
  let next = drawCardsForPlayer(state, state.currentIdx, 1)
  const nextIdx = getNextIdx(next)
  return { ...next, currentIdx: nextIdx, extraTurn: false }
}