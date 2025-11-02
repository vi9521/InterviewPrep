import React, { useContext, useState } from 'react'
import { ChevronRight, CheckCircle, Star, Users, BookOpen, Target, ArrowRight, Menu, X, LogIn, ImageOff } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom"
import Login from "../pages/Auth/Login"
import SignUp from "../pages/Auth/SignUp"
import Modal from '../components/modal/Modal'
import { UserContext } from '../context/userContext'
import ProfileInfoCard from '../components/Cards/ProfileInfoCard'

function LandingPage() {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  const [openAuthModal, setOpenAuthModal] = useState(false)
  const [currentPage, setCurrentPage] = useState('login')

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleCTA = (page) => {
    if (!user) {
      setOpenAuthModal(true)
      setCurrentPage(page || "signup")
    }
    else {
      navigate('/dashboard')
    }
  }

  const handleLink = (page, link) => {
    if (!user) {
      setOpenAuthModal(true)
      setCurrentPage(page || "signup")
    }
    else {
      navigate(link)
    }
  }

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Job-Specific Questions",
      description: "Get AI-powered questions and answers tailored to specific job roles"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Detailed Explanations",
      description: "Understand every question thoroughly with step-by-step explanations"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Structured Learning",
      description: "All content organized clearly for easy navigation and better understanding"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      content: "This platform helped me land my dream job! The mock interviews were incredibly realistic.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Product Manager at Meta",
      content: "The personalized questions really helped me identify my weak areas and improve.",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "Data Scientist at Netflix",
      content: "Best interview prep resource I've used. The feedback was detailed and actionable.",
      rating: 5
    }
  ]

  return (
    <div className="">
      {/* Navigation */}
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
            <div className="block sm:hidden md:hidden relative z-50 order-first">
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
                  <div
                    onClick={(e) => { setMobileMenuOpen(false); handleLink("login", "/"); }}
                    className="px-5 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors cursor-pointer rounded-lg hover:bg-purple-50"
                  >
                    Home
                  </div>
                  <div
                    onClick={(e) => { setMobileMenuOpen(false); handleLink("login", "/dashboard"); }}
                    className="px-5 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors cursor-pointer rounded-lg hover:bg-purple-50"
                  >
                    Questions
                  </div>
                  <div
                    onClick={(e) => { setMobileMenuOpen(false); handleLink("login", "/interview/dashboard"); }}
                    className="px-5 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors cursor-pointer rounded-lg hover:bg-purple-50"
                  >
                    Mock
                  </div>
                </div>
              )}
            </div>

            {/* Desktop navigation */}
            <div className="hidden sm:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
              <div
                onClick={(e) => handleLink("login", "/")}
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors cursor-pointer"
              >
                Home
              </div>
              <div
                onClick={(e) => handleLink("login", "/dashboard")}
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors cursor-pointer"
              >
                Questions
              </div>
              <div
                onClick={(e) => handleLink("login", "/interview/dashboard")}
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors cursor-pointer"
              >
                Mock
              </div>
            </div>

            {/* Desktop Navigation */}
            {!user ?
              <div className="items-center space-x-4 sm:space-x-8">
                <button
                  onClick={(e) => handleCTA("login")}
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors cursor-pointer text-sm sm:text-base"
                >
                  LogIn
                </button>
                <button
                  onClick={(e) => handleCTA("signup")}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer text-sm sm:text-base"
                >
                  SignUp
                </button>
              </div> :
              <div>
                <ProfileInfoCard />
              </div>
            }
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Ace Your Next
              </span>
              <br />
              <span className="text-gray-800">Interview</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Master technical and behavioral interviews with AI-powered practice,
              Structured company-specific questions and AI-powered Insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={(e) => handleCTA("login")}
                className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Start Practicing Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="text-purple-600 hover:text-purple-700 px-8 py-4 text-lg font-semibold transition-colors flex items-center space-x-2">
                <span>Watch Demo</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  100+
                </div>
                <div className="text-gray-600">Success Stories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  95%
                </div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  1000+
                </div>
                <div className="text-gray-600">Practice Questions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform combines AI-powered practice with human expertise
              to give you the edge in any interview.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100"
              >
                <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-xl w-fit mb-6 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App preview section */}
      <section className='bg-white/50 mb-16'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <img src="/preview.png" alt="" className='w-full h-full object-cover ' />
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Loved by
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Professionals</span>
            </h2>
            <p className="text-xl text-gray-600">See what our users say about their interview success</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-purple-100 mb-10">
            Take your interview preparation to the next level with our AI-powered platform designed to help you succeed.
          </p>
          <button
            onClick={(e) => handleCTA("login")}
            className="bg-white text-purple-600 px-10 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2"
          >
            <span>Start Your Preparation</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">PrepBuddy </span>
              </div>
              <p className="text-gray-400">
                Empowering students and professionals to ace their interviews and land their dream jobs.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mock Interviews</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PrepBuddy . All rights reserved.</p>
          </div>


        </div>
      </footer>

      {/* show login or signup page using Modal */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false)
          setCurrentPage('login')
        }}
      >
        <div>
          {currentPage === 'login' && (<Login setCurrentPage={setCurrentPage} />)}
          {currentPage === 'signup' && (<SignUp setCurrentPage={setCurrentPage} />)}
        </div>
      </Modal>

    </div>
  )
}

export default LandingPage