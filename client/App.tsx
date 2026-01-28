import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import InfluencerDetail from './pages/InfluencerDetail'
import InfluencerForm from './pages/InfluencerForm'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/influencer/:id" element={<InfluencerDetail />} />
        <Route path="/influencer/new" element={<InfluencerForm />} />
        <Route path="/influencer/:id/edit" element={<InfluencerForm />} />
      </Routes>
    </div>
  )
}

export default App
