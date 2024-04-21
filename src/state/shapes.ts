import { atom, Atom, useAtom } from "jotai"
import { Id, Shape, ShapeType, Type } from "@/lib/types"
import { PrimitiveAtom } from "jotai/vanilla";

export let shapeAtoms = atom<Id<Type<PrimitiveAtom<Shape>>>[]>([])

export const addShape = (shape: PrimitiveAtom<Shape>, type: ShapeType) => {
  const [_, setShapeAtoms] = useAtom(shapeAtoms);
  setShapeAtoms(objs => ([...objs, { id: randomUUID(), type, ...shape }]))
}

export const removeShape = (id: string) => {
  const [shapes, setShapeAtoms] = useAtom(shapeAtoms);
  setShapeAtoms(shapes.filter(s => s.id != id));
}

export const getShape = (id: string) => {
  const [shapes, _] = useAtom(shapeAtoms);
  return shapes.find(a => a.id == id);
}
