import { DrawQuestApp } from "../main"

// the buffer height between selectionRectangle and selected object
export const RangeMargin = 3;

// the type of the tools or shapes available
export type QuestType = "rectangle" | "ellipse" | "selection";

// represents the type of coordinates returned by the coods function of the quest shape object
type Coordinates<T> = T extends Ellipse ?
        {center: [number,number], radiusX:number, radiusY:number} :
            T extends Rectangle ? {start:[number,number], w:number, h:number}:any;

// represents the event Listeners that would be binded to the canvas element
export type Listeners = {
    onmousemove: ( e:MouseEvent)=>void,
    onmousedown: (e:MouseEvent)=>void,
    onmouseup: (e:MouseEvent)=>void,
    onclick?: (e:MouseEvent)=>void
}

// represent a generic Tool it takes a T type parameter
// the T is the type of object that the tool creates (create method)
export interface Tool<T extends QuestShape> {
    active: boolean,
    type: QuestType,
    draw(this: CanvasRenderingContext2D, q: QuestShape): void,
    on():void,
    off():void,
    initialise(this: DrawQuestApp): Listeners,
    create(e:Event): T
}

// a generic type for a QuestShape
export interface QuestShape {
    type: QuestType, 
    ref: string,
    _coords: [ [number, number], [number, number], [number, number], [number, number] ]
    origin: [number, number],
    coords(): Coordinates<any>,
    update(e: Event): void
}

// generate a random refrence for a QuestShape
export function genrateRef():string{
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
// ! using intefaces so I could extend the type with methods
//represents a Rectangle
export interface Rectangle extends QuestShape {
    type: "rectangle",
    coords(): Coordinates<Rectangle>
}

// represent an Ellipse
export interface Ellipse extends QuestShape {
    type: "ellipse",
    coords(): Coordinates<Ellipse>
}

// represention the selection rectangle around selected object
export interface SelectionRect extends QuestShape {
    children: QuestShape[],
    coords():Coordinates<Rectangle>,
    getBoundingRect():Coordinates<Rectangle>,
}

// update shape coordinates from the current Event
export const UpdateShape = function(this: QuestShape , e:MouseEvent):void{
    let currentMousePosition:[number, number] = [e.clientX, e.clientY];

    if(currentMousePosition[0]>=this.origin[0]&&currentMousePosition[1]>=this.origin[1]){

        this._coords[0] = [...this.origin]
        this._coords[1] = [currentMousePosition[0],this.origin[1]];
        this._coords[2] = currentMousePosition;
        this._coords[3] = [this.origin[0],currentMousePosition[1]];

    } else if(currentMousePosition[0]<this.origin[0]&&currentMousePosition[1]>=this.origin[1]){

        this._coords[0] = [currentMousePosition[0], this.origin[1]];
        this._coords[1] = [...this.origin];
        this._coords[2] = [this.origin[0], currentMousePosition[1]];
        this._coords[3] = currentMousePosition

    } else if(currentMousePosition[0]>=this.origin[0] &&currentMousePosition[1]<this.origin[1]){

        this._coords[0] = [this.origin[0], currentMousePosition[1]];
        this._coords[1] = currentMousePosition;
        this._coords[2] = [currentMousePosition[0], this.origin[1]];
        this._coords[3] = [...this.origin]

    } else if(currentMousePosition[0]<this.origin[0]&&currentMousePosition[1]<this.origin[1]){

        this._coords[0] = currentMousePosition;
        this._coords[1] = [this.origin[0], currentMousePosition[1]];
        this._coords[2] = [...this.origin];
        this._coords[3] = [currentMousePosition[0], this.origin[1]];

    }
}

export function inRect(p:[number, number], coords: QuestShape['_coords']):boolean {
    return p[0]>coords[0][0] && p[0]<coords[1][0] && p[1]>coords[0][1] && p[1]<coords[3][1]
}

