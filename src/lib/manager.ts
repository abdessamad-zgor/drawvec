/**
 * Introducing modes.
 *
 * a mode is a set behaviors that a given tool can support in response to particular event
 * meaning that a tool behaves diffrently depending on the current mode.
 *
 * when a mode is changed the tool selected is re initialized and new event listners are provided
 *
 * draw mode: when a shape tool is toggled. tools in this mode are only allowed to add objects to the rendrer and request 
 * a re-render on each change
 *
 * select mode: when the selection tool is toggled  in this mode a shape if to be selected and the custimization menu toggled
 *
 * resize mode: when a SelectionNode is selected the shape updates it's coordinates and dimentions
 *
 * custimize mode: whan a shape is selected and an option is selected from the customization menu the selected shape 
 * is redrawn with it's new properties
 */

import { DrawQuestApp } from "../main";
import { Renderer } from "./renderer";
import { QuestShape, Tool } from "./utils";
import { Toolbar } from "./tools/index";

// update a shape on mouse move
// export function update()

type ModeName = "selection" | "draw" | "customize" | "resize" | "move"

/**
 * a mode is a set behaviors that a given tool can support in response to particular event
 * meaning that a tool behaves diffrently depending on the current mode.
 * */

export class Mode {
  name: ModeName;
  constructor(name: ModeName){
    this.name = name
  }
}

/**
 * a manager that holds the refs of all the the other components, 
 * manages the events, modes and binds the function's this 
**/ 
export class Manager {
  toolbar: Toolbar;
  renderer: Renderer;
  app: DrawQuestApp;
  currentMode: Mode;

  constructor(toolbar: Toolbar, renderer: Renderer, app: DrawQuestApp ){
    this.toolbar = toolbar;
    this.renderer = renderer;
    this.app = app;
    this.currentMode = new Mode("selection")
  }


}



// show a select cursor when a shape is in mouse range
// export function updateCursor()

// attach new event listners and remove the old ones
// export attachListners()
export function attachCanvasListners(canvas:HTMLCanvasElement, mode: string, tool: Tool<QuestShape>){
  let listners = tool.initialise();
  for (let k of Object.keys(listners)){
    canvas[k as keyof HTMLCanvasElement] = listners[mode][k]
  }
}

// detects which mode is the app is currently in if the mode is not the same as the current ones
// update the current mode
// export function updateMode()


export function event(this: EventTarget, eventName: string, detail: any) {
  let event = new CustomEvent(eventName, {detail: {...detail}});
  this.dispatchEvent(event);
};

// request a rerender from the Rendrer object
export function requestRerender(target: Rendrer, tools: typeof Toolbar.tools ){
  event("rerender", target, {tools});
}

export function listener<R>(f: (...args: any[])=>R, args: T ){
  return function (this: EventTarget, eventName: string, detail: any){
    return (e: Event)=>{
      f(args);
      event.call(this, eventName, {tools: detail})
    }
  }
}

export function attach<T extends EventTarget,P ,R>( this: T, eventName: string, f:({...args}:P)=>R ){
  let listner = listener(f, args)
  this.addEventListener(eventName, (e)=>{
    f(e as P)
  })
}

// event functions
// event listner functions should be changed to normal anonymous functions
// should only be used with call

/**
 * adds an object to the objects array in the renderer
 */
export function addObject<F extends Tool<any>>(this: F, f:<T>(e: MouseEvent)=>void|T){
  const boundF = f.bind(this)
  let listener =function  <T extends Manager>(this:T, e:MouseEvent) {
    let object = boundF(e);
    if(object) {
      event.call(this.renderer, "add-object", {detail: {object}})
      requestRerender(this.renderer, this.toolbar.tools)
    }else {
      console.error("Object not returned")
    }
  }

  return listener;
}

export function updateObject<F extends Tool<any>>(this: F, f:<T>(e: MouseEvent)=>void|T){
  const boundF = f.bind(this)

  let listener =function  <T extends Manager>(this:T, e:MouseEvent) {
    let object = boundF(e);
    if(object) {
      event.call(this.renderer, "update-shape", {detail: {object}})
      requestRerender(this.renderer, this.toolbar.tools)
    }else {
      console.error("Object not returned")
    }
  }

  return listener;
} 


