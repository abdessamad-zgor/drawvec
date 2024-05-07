import { useCanvas } from '@/hooks/canvas'
import Shape from './shapes/Shape'

function Canvas() {
  let { shapes, canvasRef } = useCanvas()
  return (
    <div className="border bg-white">
      <svg ref={canvasRef} className='' width={500} height={600} xmlns='http://www.w3.org/2000/svg'>
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
