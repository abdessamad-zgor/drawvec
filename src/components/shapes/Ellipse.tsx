import React from 'react'
import type { Ellipse } from '../../utils/types'

function Ellipse({ rx, ry, cx, cy }: Ellipse) {
  return (
    <ellipse rx={rx} ry={ry} cx={cx} cy={cy} />
  )
}

export default Ellipse
