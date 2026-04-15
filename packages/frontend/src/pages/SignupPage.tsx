import { useNavigate } from 'react-router-dom'

export default function SignupPage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-md mx-auto px-6 py-16">

      <div className="text-center mb-8">
        <h1 className="text-2xl font-medium text-brown-900 mb-1">회원가입</h1>
        <p className="text-brown-600 text-sm">함께 게임을 즐겨봐요.</p>
      </div>

      <div className="bg-ivory border border-brown-100 rounded-2xl p-6 flex flex-col gap-4">

        <div className="flex flex-col gap-1.5">
          <label className="text-brown-700 text-sm font-medium">닉네임</label>
          <input
            type="text"
            placeholder="닉네임 입력"
            className="px-3 py-2.5 rounded-xl border border-brown-200 bg-cream text-brown-900 text-sm placeholder:text-brown-300 focus:outline-none focus:border-brown-600"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-brown-700 text-sm font-medium">이메일</label>
          <input
            type="email"
            placeholder="example@email.com"
            className="px-3 py-2.5 rounded-xl border border-brown-200 bg-cream text-brown-900 text-sm placeholder:text-brown-300 focus:outline-none focus:border-brown-600"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-brown-700 text-sm font-medium">비밀번호</label>
          <input
            type="password"
            placeholder="8자 이상 입력"
            className="px-3 py-2.5 rounded-xl border border-brown-200 bg-cream text-brown-900 text-sm placeholder:text-brown-300 focus:outline-none focus:border-brown-600"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-brown-700 text-sm font-medium">비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호 재입력"
            className="px-3 py-2.5 rounded-xl border border-brown-200 bg-cream text-brown-900 text-sm placeholder:text-brown-300 focus:outline-none focus:border-brown-600"
          />
        </div>

        <button className="w-full py-2.5 rounded-xl bg-brown-900 text-brown-50 text-sm font-medium hover:bg-brown-700 transition-colors mt-1">
          회원가입
        </button>

      </div>

      <p className="text-center text-brown-600 text-sm mt-6">
        이미 계정이 있으신가요?{' '}
        <button
          onClick={() => navigate('/login')}
          className="text-brown-900 font-medium hover:underline"
        >
          로그인
        </button>
      </p>

    </div>
  )
}