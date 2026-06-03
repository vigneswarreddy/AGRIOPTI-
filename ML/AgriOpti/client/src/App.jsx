import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Forum from './pages/Forum'
import Market from './pages/Market'
import MarketCategory from './pages/MarketCategory'
import Seeder from './pages/Seeder'
import Weather from './pages/Weather'
import Home from './pages/Home'
import Crops from './Components/Market/Crops'
import Pesticides from './Components/Market/Pesticides'
import Machinery from './Components/Market/Machinery'
import Inventory from './Components/Market/Inventory'
import Dashboard from './pages/Dashboard'
import Education from './pages/Education'
import Order from './pages/Order'
import Nearby from './pages/Nearby'
import LandRecords from './pages/LandRecords'
import About from './pages/About'
import CropRecommendationPage from './pages/CropRecommendationPage'
import PlantDiseasePage from './pages/PlantDiseasePage'
import CropYieldPage from './pages/CropYieldPage'
import AIChatbot from './pages/AIChatbot'
import AerialLandPage from './pages/AerialLandPage'
import FertilizerPredictionPage from './pages/FertilizerPredictionPage'
import Developers from './pages/Developers'
import RoleSelection from './pages/RoleSelection'
import ScrollToTop from './Components/ScrollToTop'
import FeedbackButton from './Components/Shared/FeedbackButton'
import ProtectedRoute from './Components/ProtectedRoute'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user && user.preferredLanguage) {
      i18n.changeLanguage(user.preferredLanguage)
    }
  }, [i18n])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Login />} />
        {/* ... existing routes ... */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/select-role" element={<RoleSelection />} />

        {/* Protected Routes — All Roles */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
        <Route path="/market" element={<ProtectedRoute><Market /></ProtectedRoute>} />
        <Route path="/market/:category" element={<ProtectedRoute><MarketCategory /></ProtectedRoute>} />
        <Route path="/seed" element={<Seeder />} />
        <Route path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
        <Route path="/crops" element={<ProtectedRoute><Crops /></ProtectedRoute>} />
        <Route path="/pest" element={<ProtectedRoute><Pesticides /></ProtectedRoute>} />
        <Route path="/tools" element={<ProtectedRoute><Machinery /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/education" element={<ProtectedRoute><Education /></ProtectedRoute>} />
        <Route path="/nearby" element={<ProtectedRoute><Nearby /></ProtectedRoute>} />
        <Route path="/land-records" element={<ProtectedRoute><LandRecords /></ProtectedRoute>} />
        <Route path="/ai-chatbot" element={<ProtectedRoute><AIChatbot /></ProtectedRoute>} />

        {/* Marketplace features — open to all roles */}
        <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
        <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />

        {/* Farmer & Government only — Retailers excluded */}
        <Route path="/crop-recommendation" element={<ProtectedRoute allowedRoles={['farmer', 'government']}><CropRecommendationPage /></ProtectedRoute>} />
        <Route path="/plant-disease" element={<ProtectedRoute allowedRoles={['farmer', 'government']}><PlantDiseasePage /></ProtectedRoute>} />
        <Route path="/crop-yield" element={<ProtectedRoute allowedRoles={['farmer', 'government']}><CropYieldPage /></ProtectedRoute>} />
        <Route path="/land-analysis" element={<ProtectedRoute allowedRoles={['farmer', 'government']}><AerialLandPage /></ProtectedRoute>} />
        <Route path="/Fertilizer" element={<ProtectedRoute allowedRoles={['farmer']}><FertilizerPredictionPage /></ProtectedRoute>} />

        <Route path="/about" element={<About />} />
        <Route path="/developers" element={<Developers />} />
      </Routes>
      <FeedbackButton />
    </BrowserRouter>
  )
}

export default App
