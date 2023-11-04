import { QSelectionRect, QuestShape, Tool, RangeMargin, generateRef, isQuestShape, inRect} from "../utils";
import { UpdateShape } from "../utils";

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

export class SelectionTool implements Tool<SelectionRect> {
  active: boolean;
  type: "selection"= "selection";
  current: SelectionRect|null

  constructor() {
    this.active = false;
    this.current = null
  }

initialise(){
    // on mode Change
    // change event Listners 
  let onmousemove = (e: MouseEvent)=>{ 
      // how many cases for on mousemove
      let current = this.renderer.getCurrentObject() ;
      if(current) {
        current.update(e);
        let rerenderEvent = new CustomEvent("rerender", { detail: { tools: this.toolbar.tools } })
        this.renderer.dispatchEvent(rerenderEvent);
      } else {
        let tool = this.toolbar.selectedTool() as SelectionTool;
        let shapeInRange = tool.shapeInRange(e, this.renderer.objects);
        if(shapeInRange) this.canvas.style.cursor = "pointer"
        else this.canvas.style.cursor = "default"
      }
    }

    let onmousedown = (e: MouseEvent)=>{
      let newShape = this.toolbar.selectedTool().create(e);
      this.renderer.setCurrentObject(newShape)
    }

    let onmouseup = (e: MouseEvent)=>{
      let current = this.renderer.getCurrentObject();
      current?.update(e)
      this.renderer.setCurrentObject(null)
    }

    let onclick = (e:MouseEvent)=>{
      let currentObject = this.renderer.getCurrentObject();
      if(currentObject){
        if(inRect([e.clientX, e.clientY], currentObject._coords)){
          // Empliment customization options
        }else if( !inRect([e.clientX, e.clientY], currentObject._coords)){
          this.renderer.setCurrentObject(null);
        }
      } else {
        let selection = this.toolbar.selectedTool() as SelectionTool
        let shape = selection.shapeInRange(e, this.renderer.objects)
        if(shape) {
           this.renderer.setCurrentObject(toSelectionRect(shape))
        }

      }
    }

    return {onmousedown, onmousemove, onmouseup, onclick}
  }

  draw(this: CanvasRenderingContext2D, q: QuestShape): void {
    let coords = q.coords()
    this.beginPath();
    this.strokeStyle = "blue";
    this.fillStyle = "#6495ED98"
    this.rect(coords.start[0], coords.start[1], coords.w, coords.h);
    this.stroke()
  }

  on(){
    this.active = true;
  }

  off() {
    this.active = false;
  }
  // replace return type with SelectionRect
  create(e:MouseEvent): SelectionRect {
     return new SelectionRect(e);
  }

  shapeInRange(e:MouseEvent, objects: QuestShape[]){
    for (let shape of objects) {
      let bigRect:QuestShape['_coords'] = [

        [shape._coords[0][0]-RangeMargin, shape._coords[0][1]-RangeMargin],
        [shape._coords[1][0]+RangeMargin, shape._coords[1][1]-RangeMargin],
        [shape._coords[2][0]+RangeMargin, shape._coords[2][1]+RangeMargin], 
        [shape._coords[3][0]-RangeMargin, shape._coords[3][1]+RangeMargin]
      ];

      let smallRect:QuestShape['_coords'] = [
        [shape._coords[0][0]+RangeMargin, shape._coords[0][1]+RangeMargin],
        [shape._coords[1][0]-RangeMargin, shape._coords[1][1]+RangeMargin],
        [shape._coords[2][0]-RangeMargin, shape._coords[2][1]-RangeMargin],
        [shape._coords[3][0]+RangeMargin, shape._coords[3][1]-RangeMargin]
      ];


      if( inRect([e.clientX, e.clientY], bigRect) && !inRect([e.clientX, e.clientY], smallRect) )
        return shape;
    }

    return null;
  }

}


// toSelection: takes shape and turns it into selection 
export function toSelectionRect(q:QuestShape) {
  return new SelectionRect(q);
}
