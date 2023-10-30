import { Tool } from "../utils";
import { SelectionTool } from "./selection";  
import { RectangleTool } from "./rectangle";
import { EllipseTool } from "./ellipse";
import { selectTool } from "../manager";

class Toolbar extends EventTarget {
  // tools within the toolbar
  tools: {[key: string]: Tool<any>} = {};
  // id of the div element containing the toolbar
  toolsDiv: HTMLDivElement; 

  constructor (toolbarId: string) {
    super();
    let selectTool = new SelectionTool();
    let rectTool = new RectangleTool();
    let ellipTool = new EllipseTool()

    this.tools[selectTool.type] = selectTool;
    this.tools[rectTool.type] = rectTool;
    this.tools[ellipTool.type] = ellipTool;
    
    this.toolsDiv = document.getElementById(toolbarId) as HTMLDivElement
  }

  initialse() {
    let onclick = selectTool.call(this, function(this: Toolbar, e: MouseEvent){
      let id = (e.currentTarget as HTMLElement).id;
      Object.keys(this.tools).forEach(k=>{
         if ( k == id )this.tools[id].on();
         else this.tools[k].off()
      });

      return this.tools[id]
    })
    return onclick
  }

  selectedTool() {
    return Object.keys(this.tools).map(k=>this.tools[k]).find(tl=>tl.active) as Tool<any>;
  }
}

export {Toolbar}
