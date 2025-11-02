import React from 'react'
import Navbar from './Navbar'

function DashboardLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        {children}
      </div>

    </>
  )
}

export default DashboardLayout