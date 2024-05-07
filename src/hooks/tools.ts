import { useEffect } from "react";
import { Tool } from "@/lib/types";

export const useRectangleTool = () => {
  const onMouseDown = () => { }
  const onMouseMove = () => { }
  const onMouseUp = () => { }

  return {
    onMouseUp,
    onMouseDown,
    onMouseMove
  }
}

export const useEllipseTool = () => {
  const onMouseDown = () => { }
  const onMouseMove = () => { }
  const onMouseUp = () => { }

  return {
    onMouseUp,
    onMouseDown,
    onMouseMove
  }
}
export const usePathTool = () => {
  const onMouseDown = () => { }
  const onMouseMove = () => { }
  const onMouseUp = () => { }

  return {
    onMouseUp,
    onMouseDown,
    onMouseMove
  }
}

export const useSelectionTool = () => {
  const onMouseDown = () => { }
  const onMouseMove = () => { }
  const onMouseUp = () => { }

  return {
    onMouseUp,
    onMouseDown,
    onMouseMove
  }
}

export const useTool = (tool: Tool) => {
  switch (tool) {
    case Tool.RECTANGLE:
      return useRectangleTool
      break;
    case Tool.ELLIPSE:
      return useEllipseTool
      break;
    case Tool.PATH:
      return usePathTool;
      break;

    case Tool.SELECTION:
      return useSelectionTool;
      break;
    default:
      return useSelectionTool;
      break;
  }
}


