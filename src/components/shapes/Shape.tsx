import React from 'react'
import { Atom } from 'jotai';
import Rectangle from "@/components/shapes/Rectangle";
import Ellipse from "@/components/shapes/Ellipse";
import Path from '@/components/shapes/Path';
import Line from '@/components/shapes/Line';
import { type Shape, type Type, type Id, ShapeType } from '@/lib/types';

export default function Shape({ shape }: { shape: Type<Id<Atom<Shape>>> }) {
  return <>
    {
      shape.type == ShapeType.RECTANGLE ?
        <Rectangle id={shape.id} />
        :
        shape.type == ShapeType.LINE ?
          <Line id={shape.id} />
          :
          shape.type == ShapeType.PATH ?
            <Path id={shape.id} />
            :
            shape.type == ShapeType.ELLIPSE ?
              <Ellipse id={shape.id} />
              :
              <></>
    }
  </>
}
