import GameCard from '../components/ui/GameCard'
import { GAMES } from '../data/games'

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      <div className="mb-10">
        <h1 className="text-3xl font-medium text-brown-900 mb-2">
          게임 목록
        </h1>
        <p className="text-brown-600">
          플레이하고 싶은 게임을 선택하세요.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {GAMES.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

    </div>
  )
}