import { Renderer } from "./lib/renderer"
import { Toolbar } from "./lib/tools/index";
import {Manager, listener} from "./lib/manager";

type AppEvents = "attach-tool" 

// Drawquest app mannaging rendrer and toolbar and managing events between
// rendrer and toolbar
class DrawQuestApp extends EventTarget {
  renderer: Renderer;
  toolbar: Toolbar;
  canvas: HTMLCanvasElement;
  manager: Manager;
  events: Map<AppEvents, ReturnType<typeof listener>["listener"]
  constructor(canvasId: string) {
    super();
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.toolbar = new Toolbar("toolbar");
    this.renderer = new Renderer(this);
    this.manager = new Manager(this.toolbar, this.renderer, this)
    // attach event-listeners from default selected 
    let { onmousemove, onmousedown, onmouseup, onclick } = this.toolbar.initialise();
  }

  initialise() {
    this.manager.attachTargetEventListener(this, listener())
  }
}

export {DrawQuestApp};
