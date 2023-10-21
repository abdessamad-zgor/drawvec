import { DrawQuestApp } from "../main"

// the buffer height between selectionRectangle and selected object
export const RangeMargin = 3;

// the type of the tools or shapes available
export type QuestType = "rectangle" | "ellipse" | "selection";

// represents the type of coordinates returned by the coods function of the quest shape object
export type Coordinates<T> = T extends QEllipse ?
        {center: [number,number], radiusX:number, radiusY:number} :
            T extends QRectangle ? {start:[number,number], w:number, h:number}:any;

// represents the event Listeners that would be binded to the canvas element
export type Listeners = {
    onmousemove: ( e:MouseEvent)=>void,
    onmousedown: (e:MouseEvent)=>void,
    onmouseup: (e:MouseEvent)=>void,
    onclick?: (e:MouseEvent)=>void
}

// represent a generic Tool it takes a T type parameter
// the T is the type of object that the tool creates (create method)
export interface Tool<T extends QuestShape> {
    active: boolean,
    type: QuestType,
    draw(this: CanvasRenderingContext2D, q: QuestShape): void,
    on():void,
    off():void,
    initialise(this: DrawQuestApp): Listeners,
    create(e:Event): T
}

// a generic type for a QuestShape
export interface QuestShape {
    type: QuestType, 
    ref: string,
    _coords: [ [number, number], [number, number], [number, number], [number, number] ]
    origin: [number, number],
    coords(): Coordinates<any>,
    update(e: Event): void
}

// generate a random refrence for a QuestShape
export function generateRef():string{
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 6) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}
// ! using intefaces so I could extend the type with methods
//represents a Rectangle


export class Rectangle implements QRectangle {
  type: "rectangle" = "rectangle"
  ref: string;
  origin: [number, number]
  _coords: [[number, number],[number, number],[number, number],[number, number]]

  constructor (e:MouseEvent) {
    this.ref = generateRef(),
    this.origin = [e.clientX, e.clientY ],
    this._coords = [[e.clientX, e.clientY], [e.clientX+2, e.clientY], [e.clientX+2, e.clientY+2], [e.clientX, e.clientY+2] ]
  }

  coords() {
    return {
      start: this._coords[0],
      w: Math.abs(this._coords[0][0]-this._coords[1][0]),
      h: Math.abs(this._coords[0][1]-this._coords[3][1])
    }
  }
  update(e: MouseEvent) {
    UpdateShape.call(this, e)
  }
} 

// represent an Ellipse
export interface QEllipse extends QuestShape {
    type: "ellipse",
    coords(): Coordinates<QEllipse>
}

export class Ellipse implements QEllipse {
  ref: string;
  type: "ellipse" = "ellipse"
  _coords: [[number, number], [number, number], [number, number], [number, number]];
  origin: [number, number];

  constructor(e:MouseEvent){
    this.ref = generateRef()
    this.origin = [e.clientX, e.clientY]
    this._coords = [[e.clientX, e.clientY], [e.clientX+2, e.clientY], [e.clientX+2, e.clientY+2], [e.clientX, e.clientY+2] ]
  }

  coords() {
    let width = Math.abs(this._coords[0][0]-this._coords[1][0]);
    let height = Math.abs(this._coords[0][1]-this._coords[3][1]);
    let center: [number, number] = [this._coords[0][0]+width/2, this._coords[0][1]+height/2]
    return {center, radiusX: width/2, radiusY: height/2}
  }

  update(e: MouseEvent){
    UpdateShape.call(this, e)
  }
}

// represention the selection rectangle around selected object
export interface QSelectionRect extends QuestShape {
    children: QuestShape[],
    coords():Coordinates<QRectangle>,
    getBoundingRect():Coordinates<QRectangle>,
    addToChildren(q:QuestShape):void,
    removeFromChildren(q:QuestShape): void,
    toQuestShape(): QuestShape[]
}

export function isQuestShape(q:any):q is QuestShape {
  return q._coords != undefined;
}

export class SelectionRect implements QSelectionRect {
  type: "selection" = "selection"
  _coords: [[number, number], [number, number], [number, number], [number, number]];
  origin: [number, number];
  ref: string;
  children: QuestShape[];
  constructor(any: MouseEvent|QuestShape){
    if(!isQuestShape(any)){
      this.ref = generateRef(),
      this.origin = [any.clientX, any.clientY ],
      this.children = [],
      this._coords = [
          [any.clientX, any.clientY],
          [any.clientX+2, any.clientY],
          [any.clientX+2, any.clientY+2],
          [any.clientX, any.clientY+2] 
      ];
    } else {
      this.ref = generateRef();
      this.origin = any.origin;
      this._coords = [
        [any._coords[0][0]-RangeMargin, any._coords[0][1]-RangeMargin],
        [any._coords[1][0]+RangeMargin, any._coords[1][1]-RangeMargin], 
        [any._coords[2][0]+RangeMargin, any._coords[2][1]+RangeMargin], 
        [any._coords[3][0]-RangeMargin, any._coords[3][1]+RangeMargin]

      ];
      this.children = [any];
    }
  } 

  getBoundingRect(){
    if(this.children.length==0){
      let start: [number, number] = [0, 0]
      this._coords = [ [0,0],[0,0],[0,0],[0,0] ]
      return { start, w:0, h:0 }   
    } else {

      let boundX = [
        Math.min(...this.children.map((v,i)=>v._coords[i][0])),
        Math.max(...this.children.map((v,i)=>v._coords[i][0]))
      ];

      let boundY = [
        Math.min(...this.children.map((v,i)=>v._coords[i][1])),
        Math.max(...this.children.map((v,i)=>v._coords[i][1]))
      ];

      this._coords = [
        [boundX[0]-RangeMargin, boundY[0]-RangeMargin],
        [boundX[1]+RangeMargin, boundY[0]-RangeMargin], 
        [boundX[1]+RangeMargin, boundY[1]+RangeMargin], 
        [boundX[0]-RangeMargin, boundY[1]+RangeMargin]
      ];

      return this.coords()
    }
  }
  coords() {
        return {
          start: this._coords[0],
          w: Math.abs(this._coords[0][0]-this._coords[1][0]),
          h: Math.abs(this._coords[0][1]-this._coords[3][1])
        }
  }

  update(e: MouseEvent): void {
      UpdateShape.call(this, e)
  }

  removeFromChildren(q: QuestShape): void {
    let childIndex = this.children.findIndex(s=>s.ref == q.ref)
    this.children = [...this.children.slice(0, childIndex), ...this.children.slice(childIndex+1)]
  }

  addToChildren(q: QuestShape): void {
      this.children = [...this.children, q];
  }

  toQuestShape(): QuestShape[] {
      return [...this.children]
  }

}

// update shape coordinates from the current Event
export const UpdateShape = function(this: QuestShape , e:MouseEvent):void{
    let currentMousePosition:[number, number] = [e.clientX, e.clientY];

    if(currentMousePosition[0]>=this.origin[0]&&currentMousePosition[1]>=this.origin[1]){

        this._coords[0] = [...this.origin]
        this._coords[1] = [currentMousePosition[0],this.origin[1]];
        this._coords[2] = currentMousePosition;
        this._coords[3] = [this.origin[0],currentMousePosition[1]];

    } else if(currentMousePosition[0]<this.origin[0]&&currentMousePosition[1]>=this.origin[1]){

        this._coords[0] = [currentMousePosition[0], this.origin[1]];
        this._coords[1] = [...this.origin];
        this._coords[2] = [this.origin[0], currentMousePosition[1]];
        this._coords[3] = currentMousePosition

    } else if(currentMousePosition[0]>=this.origin[0] &&currentMousePosition[1]<this.origin[1]){

        this._coords[0] = [this.origin[0], currentMousePosition[1]];
        this._coords[1] = currentMousePosition;
        this._coords[2] = [currentMousePosition[0], this.origin[1]];
        this._coords[3] = [...this.origin]

    } else if(currentMousePosition[0]<this.origin[0]&&currentMousePosition[1]<this.origin[1]){

        this._coords[0] = currentMousePosition;
        this._coords[1] = [this.origin[0], currentMousePosition[1]];
        this._coords[2] = [...this.origin];
        this._coords[3] = [currentMousePosition[0], this.origin[1]];

    }
}
// toSelection: takes shape and turns it into selection 
export function toSelectionRect(q:QuestShape) {
  return new SelectionRect(q);
}

// returns boolean if point p is in the range of a certain shape
export function inRect(p:[number, number], coords: QuestShape['_coords']):boolean {
    return p[0]>coords[0][0] && p[0]<coords[1][0] && p[1]>coords[0][1] && p[1]<coords[3][1]
}

