import React from 'react'
import type { Circle } from '../../utils/types'

function Circle({ cx, cy, r }: Circle) {
  return (
    <circle cx={cx} cy={cy} r={r} />
  )
}

export default Circle
