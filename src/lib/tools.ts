import { DrawQuestApp } from "../main";
import { QuestShape, QuestType, Tool, genrateRef, UpdateShape, Ellipse, Rectangle, SelectionRect, RangeMargin, inRect } from "./utils";

// create an eliiipse shape
class EllipseTool implements Tool<Ellipse> { 
  active: boolean;
  type: QuestType;

  constructor() {
    this.active = false;
    this.type = "ellipse";
  }

  initialise(this: DrawQuestApp){
    let onmousemove = (e: Event)=>{
      let current = this.renderer.getCurrentObject() as QuestShape;
      current.update(e);
      let rerenderEvent = new CustomEvent("rerender", { detail: { tools: this.toolbar.tools } })
      this.renderer.dispatchEvent(rerenderEvent);
    }

    let onmousedown = (e: Event)=>{
      let newShape = this.toolbar.selectedTool().create(e);
      this.renderer.setCurrentObject(newShape);
    }

    let onmouseup = (e: Event)=>{
      let current = this.renderer.getCurrentObject();
      current?.update(e);
      this.renderer.setCurrentObject(null);
    }

      return {onmousedown, onmousemove, onmouseup};
  }

  draw(this: CanvasRenderingContext2D, q: Ellipse): void {
    let coords = q.coords();
    
    this.beginPath();
    this.strokeStyle = "black";
    this.fillStyle = "#0000";
    this.ellipse(coords.center[0], coords.center[1], coords.radiusX, coords.radiusY, 0, 0, Math.PI *2);
    this.stroke()
  }

  on(){
    this.active = true;
  }

  off() {
    this.active = false;
  }

  create(e:MouseEvent): Ellipse {
    let ellipse =  {
      ref: genrateRef(),
      type: "ellipse",
      origin: [e.clientX, e.clientY],
      _coords: [[e.clientX, e.clientY], [e.clientX+2, e.clientY], [e.clientX+2, e.clientY+2], [e.clientX, e.clientY+2] ],
      coords: function(this){
        let width = Math.abs(this._coords[0][0]-this._coords[1][0]);
        let height = Math.abs(this._coords[0][1]-this._coords[3][1]);

        return {center: [this._coords[0][0]+width/2, this._coords[0][1]+height/2], radiusX: width/2, radiusY: height/2}
      },
      update: function(this, e:MouseEvent){
        UpdateShape.call(this, e)
      }
    } as Ellipse

    return ellipse;

  }

}

class RectangleTool implements Tool<Rectangle> {
  active: boolean;
  type: QuestType;
  
  constructor() {
    this.active = false;
    this.type = "rectangle";
  }

  initialise(this: DrawQuestApp){

    let onmousemove = (e: Event)=>{
      let current = this.renderer.getCurrentObject() as QuestShape;
      current.update(e);
      let rerenderEvent = new CustomEvent("rerender", { detail: { tools: this.toolbar.tools } })
      this.renderer.dispatchEvent(rerenderEvent);
    }

    let onmousedown = (e: Event)=>{
      let newShape = this.toolbar.selectedTool().create(e);
      this.renderer.setCurrentObject(newShape)
    }

    let onmouseup = (e: Event)=>{
      let current = this.renderer.getCurrentObject();
      current?.update(e)
      this.renderer.setCurrentObject(null)
    }
    
    return {onmousedown, onmousemove, onmouseup}
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
    let shape = {
      ref: genrateRef(),
      type: "rectangle",
      origin: [e.clientX, e.clientY ],
      _coords: [[e.clientX, e.clientY], [e.clientX+2, e.clientY], [e.clientX+2, e.clientY+2], [e.clientX, e.clientY+2] ],
      coords(this) {
        return {
          start: this._coords[0],
          w: Math.abs(this._coords[0][0]-this._coords[1][0]),
          h: Math.abs(this._coords[0][1]-this._coords[3][1])
        }
      },
      update(this, e: MouseEvent) {
        UpdateShape.call(this, e)
      }
    } as Rectangle;
    return shape
  }


}

class SelectionTool implements Tool<SelectionRect> {
  active: boolean;
  type: QuestType;
  
  constructor() {
      this.active = false;
      this.type = "selection";
  }

  initialise(this: DrawQuestApp){
      let onmousemove = (e: MouseEvent)=>{
          
          let current = this.renderer.getCurrentObject() ;
          if(current) {
              current.update(e);
              let rerenderEvent = new CustomEvent("rerender", { detail: { tools: this.toolbar.tools } })
              this.renderer.dispatchEvent(rerenderEvent);
          } else {
              let tool = this.toolbar.selectedTool() as SelectionTool;
              let shapeInRange = tool.shapeInRange(e, this.renderer.objects);
              if(shapeInRange) {
                  this.canvas.style.cursor = "pointer"
              }else{
                  this.canvas.style.cursor = "default"
              }
          }
      }

      let onmousedown = (e: Event)=>{
          let newShape = this.toolbar.selectedTool().create(e);
          this.renderer.setCurrentObject(newShape)
      }

      let onmouseup = (e: Event)=>{
          let current = this.renderer.getCurrentObject();
          current?.update(e)
          this.renderer.setCurrentObject(null)
      }

      let onclick = (e:Event)=>{
          let currentObject = this.renderer.getCurrentObject();
          if()
          
      }

      return {onmousedown, onmousemove, onmouseup}
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
      let shape = {
          ref: genrateRef(),
          type: "selection",
          origin: [e.clientX, e.clientY ],
          _coords: [
              [e.clientX, e.clientY],
              [e.clientX+2, e.clientY],
              [e.clientX+2, e.clientY+2],
              [e.clientX, e.clientY+2] 
          ],
          coords(this) {
              return {
                  start: this._coords[0],
                  w: Math.abs(this._coords[0][0]-this._coords[1][0]),
                  h: Math.abs(this._coords[0][1]-this._coords[3][1])
              }
          },

          update(this, e: MouseEvent) {
              UpdateShape.call(this, e)
          },

          children: [],

          getBoundingRect(this){
              if(this.children.length==0){

                  this._coords = [ [0,0],[0,0],[0,0],[0,0]]

                  return { start: [0,0], w:0,h:0 }   

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
      } as SelectionRect;

      return shape
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

class Toolbar extends EventTarget {
  // tools within the toolbar
  tools: {[key: string]: Tool<any>} = {};
  // id of the div element containing the toolbar
  toolsDiv: HTMLDivElement; 
  appRef: DrawQuestApp;

  constructor (toolbarId: string, app: DrawQuestApp) {
    super();
    let selectTool = new SelectionTool();
    let rectTool = new RectangleTool();
    let ellipTool = new EllipseTool()

    this.tools[selectTool.type] = selectTool;
    this.tools[rectTool.type] = rectTool;
    this.tools[ellipTool.type] = ellipTool;
    
    this.appRef = app;
    this.toolsDiv = document.getElementById(toolbarId) as HTMLDivElement
  }

  initialse() {
    this.toolsDiv.onclick = (e: Event)=>{

      let id = (e.currentTarget as HTMLElement).id;
      console.log("tools.ts, line 231 , toolId = ", id);
      Object.keys(this.tools).forEach(k=>{
        if ( k == id )this.tools[id].on();
        else this.tools[k].off()
      })
      let selectedToolEvent = new CustomEvent("selected-tool");
      this.appRef.dispatchEvent(selectedToolEvent);

    }
  }

  selectedTool() {
    return Object.keys(this.tools).map(k=>this.tools[k]).find(tl=>tl.active) as Tool<any>;
  }
}

export {Toolbar}
