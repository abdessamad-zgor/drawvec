import {
  drawRectangle,
  drawEllipse,
  QUEST_rectangle,
  QUEST_ellipse,
  type QuestShape,
  type Ellipse,
  Rectangle,
} from "./utils";

export class Rendrer extends EventTarget {
  _QuestContext: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this._QuestContext = canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  draw(objects: QuestShape[]) {
    for (let shape of objects) {
      switch (shape.type) {
        case QUEST_ellipse:
            drawEllipse.call(this._QuestContext, shape as Ellipse);
        case QUEST_rectangle:
            drawRectangle.call(this._QuestContext, shape as Rectangle);
      }
    }
    let canvasImage = this._QuestContext.getImageData(0,0,this.canvas.width, this.canvas.height);

    this._QuestContext.clearRect(0,0, this.canvas.width, this.canvas.height);
    this._QuestContext.putImageData(canvasImage, 0, 0);
  }

  listenForChanges(){
    this.addEventListener("draw", (e)=>{
        this.draw((e as CustomEvent).detail.objects)
    })
  }
}
