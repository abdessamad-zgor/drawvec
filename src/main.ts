import { Renderer } from "./lib/renderer"
import { Toolbar } from "./lib/tools";

// Drawquest app mannaging rendrer and toolbar and managing events between
// rendrer and toolbar
class DrawQuestApp extends EventTarget {
    renderer: Renderer;
    toolbar: Toolbar;
    canvas: HTMLCanvasElement;

    constructor(canvasId: string) {
        super();
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.toolbar = new Toolbar("toolbar", this);
        this.renderer = new Renderer(this);
        
        // attach event-listeners from default selected 
        let { onmousemove, onmousedown, onmouseup, onclick } = this.toolbar.selectedTool().initialise.call(this);
        this.canvas.onmousemove = onmousemove;
        this.canvas.onmouseup = onmouseup;
        this.canvas.onmousedown = onmousedown;
        this.canvas.onclick = onclick ? onclick:()=>({});
    }

    initialise() {
        // on 'rerender' pass the tools object to use them to draw the objects
        this.addEventListener("rerender", (e)=>{
            let rerenderEvent = new CustomEvent("rerender", {
                detail: {
                    tools: this.toolbar.tools
                }
            });
            this.renderer.dispatchEvent(rerenderEvent);
        });

        // on 'selected-tool' attach new event-listeners to the canvas
        this.addEventListener("selected-tool", (e)=>{
            console.log("main.ts, line 33, isDrawQuestApp = ", this);
            let { onmousemove, onmousedown, onmouseup } = this.toolbar.selectedTool().initialise.call(this);
            this.canvas.onmousemove = onmousemove;
            this.canvas.onmouseup = onmouseup;
            this.canvas.onmousedown = onmousedown;
        });
    }
}

export {DrawQuestApp};
