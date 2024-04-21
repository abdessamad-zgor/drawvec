import React from 'react'
import { useRectangle } from '@/hooks/shapes'
import { type Rectangle, type Id } from '@/lib/types'

function Rectangle(props: Id) {
  let { rectProps } = useRectangle(props.id)
  return (
    <rect {...props} />
  )
}

export default Rectangle
