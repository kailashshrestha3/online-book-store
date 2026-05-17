import React from 'react'
import Hero from '../components/Home/Hero'
import RecentlyAdd from '../components/Home/RecentlyAdd'

const Home = () => {
  return (
    <div className=' bg-zinc-900 text-white px-10 py-8'>
        <Hero />
        <RecentlyAdd/>
    </div>
  )
}

export default Home