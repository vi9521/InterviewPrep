import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'

function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isVerifying, setIsVerifying] = useState(true)
  const [emailVerificationResponse, setEmailVerificationResponse] = useState(null)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token')
        const email = searchParams.get('email')

        if (!token || !email) {
          setEmailVerificationResponse("Invalid verification link")
          setTimeout(() => {
            navigate('/')
          }, 4000)
          return
        }

        const verificationURL = `${API_PATHS.AUTH.VERIFY_EMAIL}?token=${token}&email=${email}`

        const response = await axiosInstance.get(verificationURL)

        if (response.data.success) {
          toast.success('Email verified successfully!')
          setEmailVerificationResponse(response.data.message)
          setTimeout(() => {
            navigate('/')
          }, 4000)
        }

      } catch (error) {
        toast.error(error.response?.data?.message || 'Verification failed')
        setEmailVerificationResponse(error.response.data.message)
        setTimeout(() => {
          navigate('/')
        }, 4000)
      } finally {
        setIsVerifying(false)
      }
    }

    verifyEmail()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-2xl text-center transform transition-all duration-300 hover:scale-[1.02]">
        {isVerifying ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Verifying your email...</h2>
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent"></div>
              <p className="text-gray-600 animate-pulse">Please wait while we verify your email address</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {emailVerificationResponse && (
              <>
                <h2 className="text-2xl font-bold text-gray-800">{emailVerificationResponse}</h2>
                <p className="text-gray-600">You will be redirected to the home page shortly.</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-purple-600 h-2.5 rounded-full animate-[progress_3s_ease-in-out]"></div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail