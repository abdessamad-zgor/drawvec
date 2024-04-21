import { useRef } from "react";

export const useCanvas = () => {
  let canvasRef = useRef()

  return { canvasRef }
}
