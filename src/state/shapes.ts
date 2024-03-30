import { atom, Atom, useAtom } from "jotai"
import { Id, Shape } from "../utils/types"

let shapeAtoms = atom<Id<Atom<Shape>>[]>([])

export const addShape = (shape: Id<Atom<Shape>>) => {
  const [_, setShapeAtoms] = useAtom(shapeAtoms);
  setShapeAtoms(objs => ([...objs, shape]))
}

export const removeShape = (id: string) => {
  const [shapes, setShapeAtoms] = useAtom(shapeAtoms);
  setShapeAtoms(shapes.filter(s => s.id != id));
}

export const getShape = (id: string) => {
  const [shapes, _] = useAtom(shapeAtoms);
  return shapes.find(a => a.id == id);
}
