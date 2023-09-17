import { Rendrer } from "./rendrer";
import { QUEST_ellipse, QUEST_rectangle, QuestShape, QuestToolType, UpdateShape, createQuestShape } from "./utils";

export class DrawQuestApp {
    activelyChanged: QuestShape | null = null;
    selectedTool: QuestToolType = QUEST_ellipse;
    canvas: HTMLCanvasElement;
    rendrer: Rendrer;
    objects: QuestShape[] = []
    constructor(canvasId: string){
        let canvas = document.getElementById(canvasId);
        if(canvas) this.canvas = canvas as HTMLCanvasElement;
        else throw Error("no Canvas element with id: "+canvasId+".")
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.rendrer = new Rendrer(this.canvas);
        
    }

    initialize(){
        this.canvas.onmousedown = (e)=>{
            if(this.selectedTool == QUEST_rectangle || this.selectedTool == QUEST_ellipse){
                this.activelyChanged = createQuestShape(this.selectedTool, e);
                this.objects = [...this.objects, this.activelyChanged ];
                this.render()
            }
        }
        this.canvas.onmousemove = (e)=>{
            if(this.activelyChanged){
                console.log(e.movementX)
                this.activelyChanged = UpdateShape(e, this.activelyChanged);
                this.objects[this.objects.findIndex(el=>el.ref==el.ref)] = this.activelyChanged;
                this.render()
            }
        }
        this.canvas.onmouseup = (e)=>{
            if(this.activelyChanged){
                this.activelyChanged = UpdateShape(e, this.activelyChanged);
                this.objects[this.objects.findIndex(el=>el.ref==el.ref)] = this.activelyChanged;
                this.render();
            }
            this.activelyChanged = null;
        }
        this.rendrer.listenForChanges()
    }
    render(){
        let drawEvent = new CustomEvent("draw", {detail: {objects: this.objects}})
        this.rendrer.dispatchEvent(drawEvent)
    }
}
