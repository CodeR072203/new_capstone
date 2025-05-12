import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import Pricing from './Pricing'
import Rooms from './Rooms'
import Footer from './Footer'

const Home = () => {
  return (
    <>

    <Navbar />
    <HeroSection />
    <Rooms />
    <Pricing />
    <Footer />
    </>
 
  )
}

export default Home
