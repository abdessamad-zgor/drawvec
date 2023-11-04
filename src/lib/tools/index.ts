import { SelectionTool } from "./selection";  
import { RectangleTool } from "./rectangle";
import { EllipseTool } from "./ellipse";
import { selectTool } from "../manager";
import { QuestShape } from "../utils";

export type Tools<T> = T extends SelectionTool ?
  SelectionTool : T extends RectangleTool ?
    RectangleTool : T extends EllipseTool ?
      EllipseTool : any;

export type ToolsType = SelectionTool | RectangleTool | EllipseTool;

export type QuestEvent<D = void> = D extends QuestShape ?
  CustomEvent<QuestShape> : D extends ToolsType ?
  CustomEvent<ToolsType> : MouseEvent; 

class Toolbar extends EventTarget {
  // tools within the toolbar
  tools: {[key: string]: ToolsType} = {};
  // id of the div element containing the toolbar
  toolsDiv: HTMLDivElement; 

  constructor (toolbarId: string) {
    super();
    let selectTool = new SelectionTool();
    let rectTool = new RectangleTool();
    let ellipTool = new EllipseTool();

    rectTool.on();

    this.tools[selectTool.type] = selectTool;
    this.tools[rectTool.type] = rectTool;
    this.tools[ellipTool.type] = ellipTool;
    
    this.toolsDiv = document.getElementById(toolbarId) as HTMLDivElement
  }

  initialse() {
    let onclick = selectTool.call(this, function(this: Toolbar, e: MouseEvent){
      let id = (e.currentTarget as HTMLElement).id;
      Object.keys(this.tools).forEach(k=>{
         if ( k == id ) this.tools[id].on();
         else this.tools[k].off()
      });

      return this.tools[id]
    })
    return onclick
  }

  selectedTool() {
    return Object.keys(this.tools).map(k=>this.tools[k]).find(tl=>tl.active) as ToolsType;
  }
}

export {Toolbar}
