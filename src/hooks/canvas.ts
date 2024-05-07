import { useRef } from "react";
import { shapeAtoms } from "@/state/shapes";
import { useAtomValue } from "jotai";

export const useCanvas = () => {
  let shapes = useAtomValue(shapeAtoms)
  let canvasRef = useRef()

  return { canvasRef, shapes }
}
