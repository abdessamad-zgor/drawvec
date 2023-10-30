import { DrawQuestApp } from "../main";
import { QuestShape, QuestType, Tool, generateRef, UpdateShape, QEllipse, Rectangle, SelectionRect, RangeMargin, inRect, Ellipse, toSelectionRect } from "./utils";

// creates and draws, elliptical shapes
class EllipseTool implements Tool<QEllipse> { 
  active: boolean; // true if tool is currently toggled
  type: QuestType; // represents the type of QuestShape created

  constructor() {
    this.active = false;
    this.type = "ellipse";
  }

  // setup tool behavior on specific event
  // for this stage this is enough but more complex tools will require a diffrent mechanism 
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

  // draw ellipse according to provided object
  draw(this: CanvasRenderingContext2D, q: QEllipse): void {
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

// create and draw rectangular shapes
class RectangleTool implements Tool<Rectangle> {
  active: boolean; // is tool toggled
  type: QuestType;
  
  constructor() {
    this.active = false;
    this.type = "rectangle";
  }

  // setup event listners on the canvas
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
    let shape = new Rectangle(e);
    return shape;
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
    // on mode Change
    // change 
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
