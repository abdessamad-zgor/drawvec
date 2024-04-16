import React from 'react'
import { type Rectangle, type Id } from '@/lib/types'

function Rectangle(props: Id) {
  return (
    <rect {...props} />
  )
}

export default Rectangle
