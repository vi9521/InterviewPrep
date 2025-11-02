import React, { useContext, useState } from 'react'
import ProfileInfoCard from '../Cards/ProfileInfoCard'
import { Link } from 'react-router-dom'
import { UserContext } from '../../context/userContext'
import { Target } from 'lucide-react'

function Navbar() {
    const { user } = useContext(UserContext)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    
    return (
        <nav className="relative z-50 bg-white/80 backdrop-blur-md border-b border-purple-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">

                    <div className="hidden sm:flex items-center space-x-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <Target className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            PrepBuddy
                        </span>
                    </div>

                    {/* Hamburger menu for mobile */}
                    <div className="sm:hidden relative z-50 order-first">
                        <button
                            onClick={() => setMobileMenuOpen((prev) => !prev)}
                            className="p-2 rounded-lg bg-white/40 backdrop-blur-md border border-purple-100 shadow-md focus:outline-none"
                            aria-label="Open navigation menu"
                        >
                            <svg
                                className="w-7 h-7 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        {/* Mobile menu dropdown */}
                        {mobileMenuOpen && (
                            <div className="absolute left-0 mt-2 w-44 rounded-xl shadow-lg bg-white/80 backdrop-blur-md border border-purple-100 flex flex-col py-2 space-y-1 animate-fade-in z-50">
                                <Link
                                    onClick={(e) => { setMobileMenuOpen(false); }}
                                    to="/"
                                    className="px-5 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors cursor-pointer rounded-lg hover:bg-purple-50"
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/dashboard"
                                    onClick={(e) => { setMobileMenuOpen(false); }}
                                    className="px-5 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors cursor-pointer rounded-lg hover:bg-purple-50"
                                >
                                    Questions
                                </Link>
                                <Link
                                    onClick={(e) => { setMobileMenuOpen(false); }}
                                    to="/interview/dashboard"
                                    className="px-5 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors cursor-pointer rounded-lg hover:bg-purple-50"
                                >
                                    Mock
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="hidden sm:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/dashboard"
                            className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                        >
                            Questions
                        </Link>
                        <Link
                            to="/interview/dashboard"
                            className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                        >
                            Mock
                        </Link>
                    </div>

                    <div>
                        <ProfileInfoCard />
                    </div>

                </div>
            </div>

        </nav>
    )
}

export default Navbar