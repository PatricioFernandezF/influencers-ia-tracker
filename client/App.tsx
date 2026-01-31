import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import InfluencerDetail from './pages/InfluencerDetail'
import InfluencerForm from './pages/InfluencerForm'
import Creators from './pages/Creators'
import Newsletter from './pages/Newsletter'
import Sidebar from './components/Sidebar'
import ConnectAccountModal from './components/ConnectAccountModal'

function App() {
  const [isConnectModalOpen, setConnectModalOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-gray-900">
      <Sidebar onConnect={() => setConnectModalOpen(true)} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/influencer/:id" element={<InfluencerDetail />} />
          <Route path="/influencer/new" element={<InfluencerForm />} />
          <Route path="/influencer/:id/edit" element={<InfluencerForm />} />
        </Routes>
      </div>
      <ConnectAccountModal isOpen={isConnectModalOpen} onClose={() => setConnectModalOpen(false)} />
    </div>
  )
}

export default App
