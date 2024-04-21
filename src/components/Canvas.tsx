import Shape from './shapes/Shape'
import { shapeAtoms } from '@/state/shapes'
import { useAtomValue } from 'jotai'

function Canvas() {
  const shapes = useAtomValue(shapeAtoms)
  return (
    <div className="border bg-white">
      <svg className='' width={500} height={600} xmlns='http://www.w3.org/2000/svg'>
        {
          shapes.map(
            s => <Shape shape={s} />
          )
        }
      </svg>
    </div>
  )
}

export default Canvas
