import './index.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import SiteNavbar from './components/layout/SiteNavbar.jsx'
import SiteFooter from './components/layout/SiteFooter.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import AnimalDetail from './pages/AnimalDetail.jsx'
import MapPage from './pages/MapPage.jsx'
import QuizPage from './pages/QuizPage.jsx'
import GuessSound from './pages/GuessSound.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import TeacherDashboard from './pages/TeacherDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {

  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--color-tertiary)] text-slate-800">
      <SiteNavbar />
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["student","teacher"]}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/animal/:id"
            element={
              <ProtectedRoute allowedRoles={["student","teacher"]}>
                <AnimalDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute allowedRoles={["student","teacher"]}>
                <MapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute allowedRoles={["student","teacher"]}>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guess-sound"
            element={
              <ProtectedRoute allowedRoles={["student","teacher"]}>
                <GuessSound />
              </ProtectedRoute>
            }
          />

          {/* Student protected routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Teacher protected routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}

export default App

