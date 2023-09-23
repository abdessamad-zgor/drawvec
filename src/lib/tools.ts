import { DrawQuestApp } from "../main";
import { QuestShape, QuestType, Tool } from "./utils";

class SelectionTool implements Tool {
    active: boolean;
    type: QuestType;
    
    constructor() {
        this.active = false;
        this.type = "selection";
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

        let oumouseup = (e: Event)=>{
            this.renderer.setCurrentObject(null)
        }

        return {onmousedown, onmousemove, onmouseup}
    }

    draw(this: CanvasRenderingContext2D, q: QuestShape): void {
        this.beginPath();
        this.rect(q.cords.startX, q.cords.startY, q.cords.width, q.cords.height);
        this.stroke()
    }

    on(){
        this.active = true;
    }

    off() {
        this.active = false;
    }

    create(e:MouseEvent): QuestShape {
        return {
            type: "selection",
            coords: {
                original: { x:e.clientX, y:e.clientY },
                startX: e.clientX,
                startY: e.clientY,
                width: 2,
                height: 2,
            },
            update: updateShape.call(this, e)
        }
    }

}

class Toolbar extends EventTarget {
    // tools within the toolbar
    tools: {[key: string]: Tool};
    // id of the div element containing the toolbar
    toolsDiv: HTMLDivElement; 
    appRef: DrawQuestApp;
    constructor (toolbarId: string, app: DrawQuestApp) {
        super();
        this.tools = {};
        this.appRef = app;
        this.toolsDiv = document.getElementById(toolbarId) as HTMLDivElement
    }

    initialse() {
        this.toolsDiv.onclick = (e: Event)=>{
            let id = (e.currentTarget as HTMLElement).id;
            console.log("tools.ts, line 79 , toolId = ", id);
            Object.keys(this.tools).forEach(k=>{
                if ( k == id )this.tools[id].on();
                else this.tools[k].off()
            })
            let selectedToolEvent = new CustomEvent("selected-tool");
            this.appRef.dispatchEvent(selectedToolEvent);
        }
    }

    selectedTool() {
        return Object.keys(this.tools).map(k=>this.tools[k]).find(tl=>tl.active) as Tool;
    }
}

export {Toolbar}
