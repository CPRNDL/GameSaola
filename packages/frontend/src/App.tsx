import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import LobbyPage from './pages/LobbyPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import OmokPage from './games/omok/OmokPage'
import BadukPage from './games/baduk/BadukPage'
import ChessPage from './games/chess/ChessPage'
import JanggiPage from './games/janggi/JanggiPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game/:gameId" element={<LobbyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/play/omok/local" element={<OmokPage mode="local" />} />
        <Route path="/play/omok/online" element={<OmokPage mode="online" />} />
        <Route path="/play/baduk/local" element={<BadukPage />} />
        <Route path="/play/chess/local" element={<ChessPage />} />
        <Route path="/play/janggi/local" element={<JanggiPage />} />
      </Routes>
    </Layout>
  )
}

export default App