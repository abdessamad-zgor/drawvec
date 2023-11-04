import {Tool, QuestShape, QRectangle, generateRef, UpdateShape} from "../utils"
import { updateObject, addObject } from "../manager";

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

export class RectangleTool implements Tool<Rectangle> {

  active: boolean; // is tool toggled
  type: "rectangle" = "rectangle";
  current: QuestShape | null
  
  constructor() {
    this.active = false;
    this.type = "rectangle";
    this.current = null
  }

  // setup event listners on the canvas
  initialise(){
    
  let onmousemove = updateObject.call(this, function (this: RectangleTool ,e: MouseEvent){
      if(this.current) {
        this.current.update(e)
        return this.current;
      }
      return;
    })

    let onmousedown = addObject.call(this, function(e: MouseEvent){
      this.current = this.create(e);
      return this.current;
    })

    let onmouseup = updateObject.call(this, function(e: MouseEvent){
      let current = {...this.current} as QRectangle
      this.current = null
      current.update(e)
      return current;
    });

    return {onmousedown, onmousemove, onmouseup};

  }

  draw(this: CanvasRenderingContext2D, q: Rectangle): void {
    this.beginPath();
    let coords = q.coords()
    this.fillStyle = "#0000";
    this.strokeStyle = "#000";
    this.rect(coords.start[0], coords.start[1], coords.w, coords.h);
    this.stroke()
  }

  on(){
    this.active = true;
  }

  off() {
    this.active = false;
  }

  create(e:MouseEvent): Rectangle {
    let shape = new Rectangle(e);
    return shape;
  }
}
