import Header from '@/components/Header'
import Footer from '@/components/Footer'
import React from 'react'

type BaseLayoutProps = {
  children: React.ReactNode
}

function BaseLayout({ children }) {
  return (
    <div className='w-full bg-green-400'>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default BaseLayout
