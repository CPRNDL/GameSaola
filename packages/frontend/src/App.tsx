import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import LobbyPage from './pages/LobbyPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import OmokPage from './games/omok/OmokPage'
import BadukPage from './games/baduk/BadukPage'

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
      </Routes>
    </Layout>
  )
}

export default App