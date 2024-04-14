import React from 'react'
import BaseLayout from './BaseLayout'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <BaseLayout>
      <section className="w-full h-[90vh] flex flex-col justify-center items-center text-center">
        <div className='rounded-full bg-red-500 w-5/12 relative p-2'>
          <h1 className='text-8xl text-green-300'>Drawvec</h1>
          <span className='font-thin bg-stone-100 rounded full text-sm p-1'>Cooming soon</span>
        </div>
        <Link to="/editor" className='font-bold text-white bg-sky-600 py-1 px-4 my-2 rounded hover:bg-white'>Developement version</Link>
      </section>
      <section className='px-4'>
        <h1 className='text-3xl'>Features</h1>
        <ul className='list-disc px-12 text-xl'>
          <li>Create SVG illustratons and Icons.</li>
          <li>Set CSS propeties on SVG elements.</li>
          <li>Embed Javascript in SVG.</li>
          <li>Import and modify existing SVG files.</li>
        </ul>
      </section>
    </BaseLayout>
  )
}

export default Home
