import { useState, useEffect, MouseEventHandler } from 'react'
import { useCanvas } from './canvas'
import { Rectangle, Type, Id } from '@/lib/types';
import { getShape } from '@/state/shapes'
import { atom, useAtom } from 'jotai'
import { PrimitiveAtom } from 'jotai/vanilla';

export const useRectangle = (id: string) => {
  let { canvasRef } = useCanvas()
  let rectangleAtom = getShape(id);
  let [selection, setSelection] = useState(false);
  let [rect, setRect] = useAtom(rectangleAtom as Id<Type<PrimitiveAtom<Rectangle>>>);

  const resizeHandler: MouseEventHandler = (e) => {
    // 5asà origin (x,y), so we need to calculate the diff between last position wfirst position
    let canvasRect = (canvasRef.current as HTMLCanvasElement).getBoundingClientRect()
    // Cursor position relative to canvas
    let cprc = [e.clientX - canvasRect.left, e.clientY - canvasRect.top];
    if (rect.x > cprc[0]) setRect((rect) => ({ ...rect, x: cprc[0], w: rect.x - cprc[0] }))
    if (rect.y > cprc[1]) setRect((rect) => ({ ...rect, y: cprc[1], h: rect.y - cprc[1] }))
    if (rect.x < cprc[0] && rect.y < cprc[1]) setRect((rect) => ({ ...rect, h: cprc[1] - rect.y, w: cprc[0] - rect[0] }))
  }

  return {
    rectProps: (rect as Rectangle)
  }
}
