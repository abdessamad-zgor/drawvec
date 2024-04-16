import { Tool } from "@/lib/types";
import { atom, useAtomValue, useSetAtom } from "jotai";

export const selectedToolAtom = atom<Tool>(Tool.SELECTION);

export const selectTool = (newTool: Tool) => {
  const setTool = useSetAtom(selectedToolAtom);
  setTool(newTool);
}

export const isToolSelected = (tool: Tool) => {
  const _tool = useAtomValue(selectedToolAtom);
  return _tool == tool;
}


