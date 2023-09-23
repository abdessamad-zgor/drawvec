import { DrawQuestApp } from "../main"

export type QuestType = "rectangle" | "ellipse" | "selection"

export type Listeners = {
    onmousemove: ( e:Event)=>void,
    onmousedown: (e:Event)=>void,
    onmouseup: (e:Event)=>void,
}

export interface Tool {
    active: boolean,
    type: QuestType,
    draw(this: CanvasRenderingContext2D, q: QuestShape): void,
    on():void,
    off():void,
    initialise(this: DrawQuestApp): Listeners,
    create(e:Event): QuestShape
}

export interface QuestShape {
    type: QuestType, 
    ref: string,
    cords: {
        original: {x:number, y:number},
        startX: number,
        startY: number,
        width: number,
        height: number
    },
    update(e: Event): void
}

