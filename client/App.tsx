import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import InfluencerDetail from './pages/InfluencerDetail'
import InfluencerForm from './pages/InfluencerForm'
import Creators from './pages/Creators'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/influencer/:id" element={<InfluencerDetail />} />
          <Route path="/influencer/new" element={<InfluencerForm />} />
          <Route path="/influencer/:id/edit" element={<InfluencerForm />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
