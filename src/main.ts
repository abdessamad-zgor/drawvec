import { Renderer } from "./lib/renderer"
import { Toolbar, QuestEvent } from "./lib/tools/index";
import {Manager, listener} from "./lib/manager";
import { ToolsType } from "./lib/tools/index";
import { Listeners } from "./lib/utils";

type AppEvents = "attach-tool" 

// Drawquest app mannaging rendrer and toolbar and managing events between
// rendrer and toolbar
class DrawQuestApp extends EventTarget {
  renderer: Renderer;
  toolbar: Toolbar;
  canvas: HTMLCanvasElement;
  manager: Manager;
  events: Map<AppEvents, ReturnType<typeof listener>["listener"]>;

  constructor(canvasId: string) {
    super();
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.toolbar = new Toolbar("toolbar");
    this.renderer = new Renderer(this);
    this.manager = new Manager(this.toolbar, this.renderer, this.canvas);
    this.events = new Map();
    // attach event-listeners from default selected 
    let listeners = this.toolbar.selectedTool().initialise();
    console.log(listeners)
    for (let eventName of Object.keys(listeners)){
      console.log(eventName)
      console.log(listeners[eventName as keyof typeof listeners])
      //@ts-ignore
      this.manager.attachCanvasEventListener(listener.call(this.manager, eventName, listeners[eventName as keyof typeof listeners]));
    }
  }

  initialise() {
    let boundAttachToolListner = this.manager.bindListener(listener)
    //@ts-ignore
    this.manager.attachTargetEventListener(this, boundAttachToolListner("attach-tool", <D extends ToolsType>(e: QuestEvent<D>)=>{
      let listeners = e.detail.initialise();
      for (let eventName in Object.keys(listeners)){
        let boundListener = this.manager.bindTargetListener(this.manager, listener); 
        //@ts-ignore
        this.manager.attachCanvasEventListener(boundListener(eventName, listeners[eventName as keyof typeof listeners]))
      }
    }));
  }
}

export {DrawQuestApp};
