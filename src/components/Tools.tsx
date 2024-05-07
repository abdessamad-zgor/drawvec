import React from 'react'
import { Tool } from '@/lib/types'
import { selectTool } from '@/state/tools'

function Tools() {
  return (
    <div className='absolute top-2 left-2 border p-2 flex flex-wrap w-1/6 bg-white'>
      {
        Object.values(Tool).filter(v => isNaN(Number(v))).map(
          t =>
            <div onClick={() => selectTool(Tool[t])} className='basis-1/4 border'>
              {t.charAt(0).toUpperCase()}
            </div>
        )
      }
    </div>
  )
}

export default Tools
