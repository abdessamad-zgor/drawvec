export const QUEST_rectangle = "rectangle"
export const QUEST_ellipse = "ellipse"
export const QUEST_selection = "selection"

export type QuestToolType = typeof QUEST_rectangle | typeof QUEST_ellipse | typeof QUEST_selection;
export type QuestShapeType = typeof QUEST_rectangle | typeof QUEST_ellipse | typeof QUEST_selection;

export interface QuestShape {
    ref: string,
    type: QuestShapeType,
    _coords: {
        original: {
            x:number,
            y:number
        },
        x:number,
        y:number,
        width: number,
        height: number
    }
}

function genrateRef():string{
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 6) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}
//using intefaces so I could extend the type with methods
export interface Rectangle extends QuestShape {
    type: typeof QUEST_rectangle
}

export interface Ellipse extends QuestShape {
    type: typeof QUEST_ellipse,
    center(this: Ellipse): {x:number, y: number},
    radiusX(this:Ellipse): number,
    radiusY(this:Ellipse): number
}

export function UpdateShape(e:MouseEvent, q: QuestShape):QuestShape{
    let start = { x: q._coords.x, y: q._coords.y };
    let end = { x: q._coords.x + q._coords.width, y: q._coords.y + q._coords.height }
    
    if (e.clientX<start.x && e.clientY>start.y) {
        start.x = e.clientX;
        end.x = q._coords.original.x;
    } else if (e.clientX>start.x && e.clientY<start.y) {
        start.y = e.clientY;
        end.y = q._coords.original.y;
    } else if (end.x<start.x && end.y<start.y) {
        start = { x: e.clientX, y: e.clientY };
        end = q._coords.original;
    }

    q._coords.x = start.x;
    q._coords.y = start.y;
    q._coords.width = Math.abs(start.x - end.x);
    q._coords.height = Math.abs(start.y - end.y);
    return q;
}

export function drawRectangle(this: CanvasRenderingContext2D, q:Rectangle){
    this.beginPath();
    this.rect(q._coords.x, q._coords.y, q._coords.width, q._coords.height);
    this.stroke()
}

export function drawEllipse(this: CanvasRenderingContext2D, q:Ellipse){
    let center = q.center()
    this.beginPath();
    this.ellipse(center.x, center.y, q.radiusX(), q.radiusY(), 0, 0, Math.PI *2);
    this.stroke();
}

export function createRectangle(e:MouseEvent): Rectangle {
    return {
        ref: genrateRef(),
        type: "rectangle",
        _coords:{
            original: {
                x: e.clientX,
                y: e.clientY,
            },
            x: e.clientX,
            y: e.clientY,
            width: 1,
            height: 1,
        }
    }
}

export function createEllipse(e:MouseEvent): Ellipse {
    return {
        ref: genrateRef(),
        type: "ellipse",
        _coords: {
            original: {
                x: e.clientX,
                y: e.clientY,
            },
            x:e.clientX,
            y: e.clientY,
            width: 2,
            height: 2
        },
        center: function(this){
            return {x: this._coords.x+this._coords.width/2, y: this._coords.y+this._coords.height/2}
        },
        radiusX: function(this){
            return this._coords.width/2;
        },
        radiusY: function(this){
            return this._coords.height/2;
        }
    }
}

export function createQuestShape(selectedTool: QuestToolType, e:MouseEvent):QuestShape{
    switch(selectedTool){
        case QUEST_rectangle:
            return createRectangle(e);
        case QUEST_ellipse:
            return createEllipse(e);
        default:
            // later used for selection Tool
            //@ts-ignore
            return {} as QuestShape
    }
}
