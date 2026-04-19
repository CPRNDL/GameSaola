export type DiceValues = [number, number, number, number, number]

export type ScoreCategory =
  | 'ones' | 'twos' | 'threes' | 'fours' | 'fives' | 'sixes'
  | 'choice'
  | 'fourOfAKind'
  | 'fullHouse'
  | 'smallStraight'
  | 'largeStraight'
  | 'yacht'

export const CATEGORY_LABELS: Record<ScoreCategory, string> = {
  ones: '1',
  twos: '2',
  threes: '3',
  fours: '4',
  fives: '5',
  sixes: '6',
  choice: '찬스',
  fourOfAKind: '포카인드',
  fullHouse: '풀하우스',
  smallStraight: '스몰 스트레이트',
  largeStraight: '라지 스트레이트',
  yacht: '요트',
}

export const ALL_CATEGORIES: ScoreCategory[] = [
  'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
  'choice', 'fourOfAKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yacht',
]

export type ScoreCard = Partial<Record<ScoreCategory, number>>

export function rollDice(kept: boolean[], current: DiceValues): DiceValues {
  return current.map((val, i) =>
    kept[i] ? val : Math.ceil(Math.random() * 6)
  ) as DiceValues
}

export function calcScore(category: ScoreCategory, dice: DiceValues): number {
  const counts = Array(7).fill(0)
  dice.forEach((d) => counts[d]++)
  const sum = dice.reduce((a, b) => a + b, 0)

  switch (category) {
    case 'ones': return counts[1] * 1
    case 'twos': return counts[2] * 2
    case 'threes': return counts[3] * 3
    case 'fours': return counts[4] * 4
    case 'fives': return counts[5] * 5
    case 'sixes': return counts[6] * 6
    case 'choice': return sum
    case 'fourOfAKind':
      return counts.some((c) => c >= 4) ? sum : 0
    case 'fullHouse': {
      const hasThree = counts.some((c) => c === 3)
      const hasTwo = counts.some((c) => c === 2)
      return hasThree && hasTwo ? sum : 0
    }
    case 'smallStraight': {
      const unique = new Set(dice)
      const has = (n: number) => unique.has(n)
      return (has(1)&&has(2)&&has(3)&&has(4)) ||
             (has(2)&&has(3)&&has(4)&&has(5)) ||
             (has(3)&&has(4)&&has(5)&&has(6)) ? 15 : 0
    }
    case 'largeStraight': {
      const sorted = [...new Set(dice)].sort().join('')
      return sorted === '12345' || sorted === '23456' ? 30 : 0
    }
    case 'yacht':
      return counts.some((c) => c === 5) ? 50 : 0
    default: return 0
  }
}

export function totalScore(scoreCard: ScoreCard): number {
  return Object.values(scoreCard).reduce((a, b) => a + (b ?? 0), 0)
}

export interface PlayerState {
  name: string
  scoreCard: ScoreCard
}

export function createPlayerState(name: string): PlayerState {
  return { name, scoreCard: {} }
}

export function isGameOver(players: PlayerState[]): boolean {
  return players.every((p) =>
    ALL_CATEGORIES.every((cat) => p.scoreCard[cat] !== undefined)
  )
}