import type { GameInfo } from '../../data/games'

const DIFFICULTY_LABEL = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
}

const DIFFICULTY_COLOR = {
  easy: 'text-forest-600 bg-forest-50',
  medium: 'text-brown-700 bg-brown-50',
  hard: 'text-brown-900 bg-brown-100',
}

interface GameCardProps {
  game: GameInfo
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <div className={`
      group relative bg-ivory rounded-2xl overflow-hidden
      border border-brown-100
      transition-all duration-200
      ${game.available
        ? 'hover:border-brown-400 hover:-translate-y-1 hover:shadow-lg cursor-pointer'
        : 'opacity-60 cursor-not-allowed'
      }
    `}>

      <div className="h-40 bg-brown-900 saola-pattern-dark flex items-center justify-center">
        <span className="text-brown-600 text-sm font-medium">준비 중</span>
        {!game.available && (
          <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-brown-800 text-brown-400">
            Coming soon
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-brown-900 font-medium text-base">{game.titleKo}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${DIFFICULTY_COLOR[game.difficulty]}`}>
            {DIFFICULTY_LABEL[game.difficulty]}
          </span>
        </div>

        <p className="text-brown-600 text-xs leading-relaxed mb-3">
          {game.description}
        </p>

        <div className="flex items-center justify-between text-xs text-brown-400">
          <span>{game.minPlayers}~{game.maxPlayers}인</span>
          <span>{game.duration}</span>
        </div>
      </div>

    </div>
  )
}