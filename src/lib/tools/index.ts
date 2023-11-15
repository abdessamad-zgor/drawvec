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
  name = "toolbar"
  // tools within the toolbar
  tools: {[key: string]: ToolsType} = {};
  // id of the div element containing the toolbar
  toolsDiv: HTMLDivElement; 

  constructor (toolbarId: string) {
    super();

    this.tools[SelectionTool.type] = new SelectionTool();
    this.tools[RectangleTool.type] = new RectangleTool();
    this.tools[EllipseTool.type] = new EllipseTool();
    
    this.toolsDiv = document.getElementById(toolbarId) as HTMLDivElement
  }

  initialise(){
    let listener = selectTool.call(this, function(this: Toolbar, e: MouseEvent){
      let id = (e.currentTarget as HTMLElement).id;
      Object.keys(this.tools).forEach(k=>{
         if ( k == id ) this.tools[id].on();
         else this.tools[k].off()
      });
      return this.tools[id]
    })
    return listener;
  }

  selectedTool() {
    let tool = Object.keys(this.tools).map(k=>this.tools[k]).find(tl=>tl.active) as ToolsType;
    if (tool)
      return tool; 
    else {
      this.tools["rectangle"].on();
      return this.tools["rectangle"];
    }
  }
}

export {Toolbar}
