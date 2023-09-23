import { Renderer } from "./lib/renderer"
import { Toolbar } from "./lib/tools";

class DrawQuestApp extends EventTarget {
    renderer: Renderer;
    toolbar: Toolbar;
    canvasId: string;
    canvas: HTMLCanvasElement;

    constructor(canvasId: string) {
        super();
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.toolbar = new Toolbar("toolbar", this);
        this.renderer = new Renderer(this);

        let { onmousemove, onmousedown, onmouseup } = this.toolbar.selectedTool().initialise.call(this);
        this.canvas.onmousemove = onmousemove;
        this.canvas.onmouseup = onmouseup;
        this.canvas.onmousedown = onmousedown;
    }

    initialise() {
        this.addEventListener("rerender", (e)=>{
            let rerenderEvent = new CustomEvent("rerender", {
                detail: {
                    tools: this.toolbar.tools
                }
            });
            this.renderer.dispatchEvent(rerenderEvent);
        });

        this.addEventListener("selected-tool", (e)=>{
            console.log("main.ts, line 32, isDrawQuestApp = ", this);
            let { onmousemove, onmousedown, onmouseup } = this.toolbar.selectedTool().initialise.call(this);
            this.canvas.onmousemove = onmousemove;
            this.canvas.onmouseup = onmouseup;
            this.canvas.onmousedown = onmousedown;
        });
        
    
    }
}

export {DrawQuestApp};
