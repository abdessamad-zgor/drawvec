import Shape from './shapes/Shape'
import { shapeAtoms } from '@/state/shapes'
import { useAtomValue } from 'jotai'

function Canvas() {
  const shapes = useAtomValue(shapeAtoms)
  return (
    <svg className='' width={window.innerWidth} height={window.innerHeight} xmlns='http://www.w3.org/2000/svg'>
      {
        shapes.map(
          s => <Shape shape={s} />
        )
      }
    </svg>
  )
}

export default Canvas
