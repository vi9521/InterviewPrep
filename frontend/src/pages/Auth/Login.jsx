import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from "../../context/userContext"
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { toast } from 'react-hot-toast'

function Login({ setCurrentPage }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { updateUser } = useContext(UserContext)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleGuestCredentials = () => {
    setFormData({
      email: 'guest@gmail.com',
      password: '123456'
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email) {
      setError("Please enter a valid email address")
      return
    }

    if (!formData.password) {
      setError("Please enter the password")
      return
    }

    setLoading(true)

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email: formData.email,
        password: formData.password
      })

      const token = response.data.data.token

      if (token) {
        toast.success("Login Successful")
        updateUser(response.data.data)
        navigate('/dashboard')
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message)
        setError(error.response.data.message)
      }
      else {
        setError("Something went wrong. Try again")
      }
    } finally {
      setLoading(false)
    }

  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
        <p className="text-gray-600 mt-2">Please sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'loading...' : 'Sign in'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => setCurrentPage('signup')}
            className="font-medium text-purple-600 hover:text-purple-500 cursor-pointer"
          >
            Sign up
          </button>
        </p>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          <button
            onClick={handleGuestCredentials}
            className="font-medium text-purple-600 hover:text-purple-500 cursor-pointer"
          >
            Login with Guest Credentials
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
