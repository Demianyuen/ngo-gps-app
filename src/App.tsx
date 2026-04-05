import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// User Screens
import LoginScreen from './screens/user/LoginScreen'
import EventSelectionScreen from './screens/user/EventSelectionScreen'
import MapScreen from './screens/user/MapScreen'
import QRScannerScreen from './screens/user/QRScannerScreen'
import ScoreScreen from './screens/user/ScoreScreen'
import NoticeBoardScreen from './screens/user/NoticeBoardScreen'
import RedemptionStoreScreen from './screens/user/RedemptionStoreScreen'
import CheckpointDetailScreen from './screens/user/CheckpointDetailScreen'

// Host Screens
import HostLoginScreen from './screens/host/HostLoginScreen'
import HostDashboardScreen from './screens/host/HostDashboardScreen'
import EventManagementScreen from './screens/host/EventManagementScreen'
import StoreManagementScreen from './screens/host/StoreManagementScreen'
import UserScoresScreen from './screens/host/UserScoresScreen'
import NoticeBoardManagementScreen from './screens/host/NoticeBoardManagementScreen'
import ManualRedemptionScreen from './screens/host/ManualRedemptionScreen'

function App() {
  return (
    <div className="app">
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/events" element={<EventSelectionScreen />} />
        <Route path="/map/:eventId" element={<MapScreen />} />
        <Route path="/scan/:checkpointId" element={<QRScannerScreen />} />
        <Route path="/checkpoint/:checkpointId" element={<CheckpointDetailScreen />} />
        <Route path="/scores" element={<ScoreScreen />} />
        <Route path="/notices" element={<NoticeBoardScreen />} />
        <Route path="/store" element={<RedemptionStoreScreen />} />

        {/* Host Routes */}
        <Route path="/host/login" element={<HostLoginScreen />} />
        <Route path="/host/dashboard" element={<HostDashboardScreen />} />
        <Route path="/host/events" element={<EventManagementScreen />} />
        <Route path="/host/store" element={<StoreManagementScreen />} />
        <Route path="/host/users" element={<UserScoresScreen />} />
        <Route path="/host/notices" element={<NoticeBoardManagementScreen />} />
        <Route path="/host/redemption" element={<ManualRedemptionScreen />} />
      </Routes>
    </div>
  )
}

export default App
