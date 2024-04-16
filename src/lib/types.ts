export type Point = [number, number];

export type MoveCommand = Record<"M" | "m", Point>;
export type LineCommand = Record<"L" | "l", Point>
export type HorizantalCommand = Record<"H" | "h", number>;
export type VerticalCommand = Record<"V" | "v", number>;
export type CubicCurveCommand = Record<"C" | "c", [Point, Point, Point]>
export type ShortCubicCurveCommand = Record<"S" | "s", [Point, Point]>
export type QuadraticCurveCommand = Record<"Q" | "q", [Point, Point]>
export type ShortQuadraticCurveCommand = Record<"T" | "t", Point>
export type ArcCommand = Record<"A" | "a", {
  rx: number;
  ry: number;
  xAxisRotation: number;
  largeArcFlag: number;
  sweepFlag: number;
  x: number;
  y: number;
}>

export type Command = MoveCommand
  | LineCommand
  | HorizantalCommand
  | VerticalCommand
  | CubicCurveCommand
  | QuadraticCurveCommand
  | ShortQuadraticCurveCommand
  | ShortCubicCurveCommand
  | ArcCommand;

export type Style = {
  fill?: string;
  strokeWidth?: number;
  stroke?: string;
}

export type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Ellipse = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export type Line = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export type Path = {
  d: Command[];
  closed?: boolean;
}

export type Shape = Rectangle | Ellipse | Line | Path;
export type Id<T = {}> = { id: string } & T;
export type Type<T> = { type: ShapeType } & T;

export enum ShapeType {
  RECTANGLE = "RECTANGLE",
  ELLIPSE = "ELLIPSE",
  LINE = "LINE",
  PATH = "PATH",
}

export enum Tool {
  RECTANGLE = "RECTANGLE",
  ELLIPSE = "ELLIPSE",
  LINE = "LINE",
  PATH = "PATH",
  SELECTION = "SELECTION"
} 
