export default function Header() {
  return (
    <header className="bg-brown-900 saola-pattern-dark border-b border-brown-700">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brown-600 flex items-center justify-center text-brown-100 text-sm font-medium">
            G
          </div>
          <span className="text-xl font-medium"
            style={{
              background: 'linear-gradient(90deg, #E8C9A8 0%, #F5D9BC 50%, #C8956B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            GameSaola
          </span>
        </div>

        <nav className="flex items-center gap-6">
          <a href="/" className="text-brown-200 hover:text-brown-50 text-sm transition-colors">
            게임
          </a>
          <a href="/about" className="text-brown-200 hover:text-brown-50 text-sm transition-colors">
            소개
          </a>
          <button className="px-4 py-1.5 rounded-lg border border-brown-600 text-brown-200 hover:bg-brown-700 text-sm transition-colors">
            로그인
          </button>
        </nav>

      </div>
    </header>
  )
}