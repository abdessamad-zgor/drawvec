import { DrawQuestApp } from "../../main";
import { Tool } from "../modes";







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
