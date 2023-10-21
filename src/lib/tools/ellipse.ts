import { QEllipse, generateRef, Tool, QuestShape } from "../utils";
import { UpdateShape } from "../utils";
import { addObject, updateShape } from "../manager";

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

export class EllipseTool implements Tool<QEllipse> { 
  active: boolean; // true if tool is currently toggled
  type: "ellipse"= "ellipse"; // represents the type of QuestShape created
  current: QuestShape | null

  constructor() {
    this.active = false;
    this.current = null
  }

  // setup tool behavior on specific event
  // for this stage this is enough but more complex tools will require a diffrent mechanism 
  initialise(){
    let onmousemove = updateObject((e: MouseEvent)=>{
      if(this.current) {
        this.current.update(e)
        return this.current;
      }
      return;
    })

    let onmousedown = addObject((e: MouseEvent)=>{
      this.current = this.create(e);
      return this.current;
    })

    let onmouseup = updateObject((e: MouseEvent)=>{
      let current = {...this.current} as QEllipse
      this.current = null
      current.update(e)
      return current;
    });

    return {onmousedown, onmousemove, onmouseup};
  }

  // draw ellipse according to provided object
  draw(this: CanvasRenderingContext2D, q: Ellipse): void {
    let coords = q.coords();
    
    this.beginPath();
    this.strokeStyle = "black";
    this.fillStyle = "#0000";
    this.ellipse(coords.center[0], coords.center[1], coords.radiusX, coords.radiusY, 0, 0, Math.PI *2);
    this.stroke()
  }

  // toggle active value to true
  on(){
    this.active = true;
  }

  // toggle active value to false
  off() {
    this.active = false;
  }

  // toggle active value to true
  create(e:MouseEvent): QEllipse {
    let ellipse = new Ellipse(e) 
    return ellipse;
  }

}
