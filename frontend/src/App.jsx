import React, { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Home/Dashboard'
import InterviewPrep from './pages/InterviewPrep/InterviewPrep'
import { Toaster } from "react-hot-toast"
import { UserContext } from "./context/userContext"
import VerifyEmail from './pages/VerifyEmail/VerifyEmail'
import MockInterviewDashboard from './pages/MockInterview/MockInterviewDashboard'
import PastInterviewDetails from './pages/MockInterview/PastInterviewDetails'
import Interview from './pages/MockInterview/Interview'

function App() {
  const { user } = useContext(UserContext)

  return (
    <div >
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage />} />

          {user && <Route path='/dashboard' element={<Dashboard />} />}
          {user && <Route path='/interview-prep/:sessionId' element={<InterviewPrep />} />}

          <Route path='/verify-email' element={<VerifyEmail />} />

          {user && <Route path='/interview/dashboard' element={<MockInterviewDashboard />} />}
          {user && <Route path='/interview/:interviewId' element={<PastInterviewDetails />} />}
          {user && <Route path='/interview/mock/:interviewId' element={<Interview />} />}
        </Routes>
      </Router>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "12px",

          }
        }}
      />
    </div>
  )
}

export default App