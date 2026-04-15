import { useParams, useNavigate } from 'react-router-dom'
import { GAMES } from '../data/games'

export default function LobbyPage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const game = GAMES.find((g) => g.id === gameId)

  if (!game) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 text-brown-700">
        게임을 찾을 수 없습니다.
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">

      <button
        onClick={() => navigate('/')}
        className="text-brown-600 hover:text-brown-900 text-sm mb-8 flex items-center gap-1 transition-colors"
      >
        ← 목록으로
      </button>

      <h1 className="text-3xl font-medium text-brown-900 mb-1">{game.titleKo}</h1>
      <p className="text-brown-600 text-sm mb-8">{game.description}</p>

      <div className="flex flex-col gap-4">

        <div className="bg-ivory border border-brown-100 rounded-2xl p-6">
          <h2 className="text-brown-900 font-medium mb-1">혼자 플레이</h2>
          <p className="text-brown-600 text-sm mb-4">컴퓨터와 대전하거나 혼자 연습합니다.</p>
          <button className="w-full py-2.5 rounded-xl bg-brown-900 text-brown-50 text-sm font-medium hover:bg-brown-700 transition-colors">
            싱글 플레이 시작
          </button>
        </div>

        <div className="bg-ivory border border-brown-100 rounded-2xl p-6">
          <h2 className="text-brown-900 font-medium mb-1">같이 플레이</h2>
          <p className="text-brown-600 text-sm mb-4">같은 컴퓨터에서 여러 명이 함께 플레이합니다.</p>
          <button className="w-full py-2.5 rounded-xl bg-brown-900 text-brown-50 text-sm font-medium hover:bg-brown-700 transition-colors">
            로컬 멀티 시작
          </button>
        </div>

        <div className="bg-ivory border border-brown-100 rounded-2xl p-6">
          <h2 className="text-brown-900 font-medium mb-4">온라인 멀티플레이</h2>

          <div className="flex flex-col gap-3">
            <div>
              <p className="text-brown-600 text-sm mb-2">새 방 만들기</p>
              <button className="w-full py-2.5 rounded-xl bg-brown-700 text-brown-50 text-sm font-medium hover:bg-brown-600 transition-colors">
                방 만들기
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-brown-100" />
              <span className="text-brown-400 text-xs">또는</span>
              <div className="flex-1 h-px bg-brown-100" />
            </div>

            <div>
              <p className="text-brown-600 text-sm mb-2">방 코드로 입장</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="6자리 코드 입력"
                  maxLength={6}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-brown-200 bg-cream text-brown-900 text-sm placeholder:text-brown-300 focus:outline-none focus:border-brown-600 uppercase tracking-widest"
                />
                <button className="px-4 py-2.5 rounded-xl bg-brown-700 text-brown-50 text-sm font-medium hover:bg-brown-600 transition-colors">
                  입장
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}