export interface GameInfo {
  id: string
  title: string
  titleKo: string
  description: string
  minPlayers: number
  maxPlayers: number
  duration: string
  difficulty: 'easy' | 'medium' | 'hard'
  available: boolean
}

export const GAMES: GameInfo[] = [
  {
    id: 'omok',
    title: 'Omok',
    titleKo: '오목',
    description: '가로, 세로, 대각선으로 5개를 먼저 놓으면 승리',
    minPlayers: 2,
    maxPlayers: 2,
    duration: '10~20분',
    difficulty: 'easy',
    available: false,
  },
  {
    id: 'baduk',
    title: 'Baduk',
    titleKo: '바둑',
    description: '집을 많이 차지한 쪽이 승리하는 전략 게임',
    minPlayers: 2,
    maxPlayers: 2,
    duration: '30분~',
    difficulty: 'hard',
    available: false,
  },
  {
    id: 'chess',
    title: 'Chess',
    titleKo: '체스',
    description: '상대방의 킹을 잡으면 승리하는 고전 전략 게임',
    minPlayers: 2,
    maxPlayers: 4,
    duration: '20~60분',
    difficulty: 'medium',
    available: false,
  },
  {
    id: 'janggi',
    title: 'Janggi',
    titleKo: '장기',
    description: '한국 전통 전략 보드게임',
    minPlayers: 2,
    maxPlayers: 2,
    duration: '20~40분',
    difficulty: 'medium',
    available: false,
  },
  {
    id: 'checker',
    title: 'Checkers',
    titleKo: '체커',
    description: '상대 말을 모두 잡거나 움직이지 못하게 하면 승리',
    minPlayers: 2,
    maxPlayers: 2,
    duration: '15~30분',
    difficulty: 'easy',
    available: false,
  },
  {
    id: 'yacht',
    title: 'Yacht Dice',
    titleKo: '요트',
    description: '주사위 5개로 조합을 완성하는 전략 주사위 게임',
    minPlayers: 1,
    maxPlayers: 4,
    duration: '20~40분',
    difficulty: 'easy',
    available: false,
  },
  {
    id: 'onecard',
    title: 'One Card',
    titleKo: '원카드',
    description: '손패를 가장 먼저 다 내려놓으면 승리',
    minPlayers: 2,
    maxPlayers: 8,
    duration: '10~30분',
    difficulty: 'easy',
    available: false,
  },
  {
    id: 'through-the-ages',
    title: 'Through the Ages',
    titleKo: '쓰루 더 에이지스',
    description: '문명을 발전시켜 가장 높은 문화 점수를 얻으면 승리',
    minPlayers: 1,
    maxPlayers: 4,
    duration: '60분~',
    difficulty: 'hard',
    available: false,
  },
]