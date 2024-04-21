import Canvas from '@/components/Canvas'
import Tools from '@/components/Tools'
import React from 'react'

function Editor() {
  return (
    <div className='relative w-full flex justify-center items-center bg-stone-300 min-h-screen'>
      <Tools />
      <Canvas />
    </div>
  )
}

export default Editor
