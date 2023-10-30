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

/**
 * given a this context that extends EventTarget , eventName and detail , it will create a custom event with the
 * params eventName and detail and dispatch it to the this context 
 * */
export function event(this: EventTarget, eventName: string, detail: any) {
  let event = new CustomEvent(eventName, {detail: {...detail}});
  this.dispatchEvent(event);
};

/**
 * request a rerender from the Rendrer object
 * */
export function requestRerender(target: Renderer, tools:  Toolbar["tools"] ){
  event.call(target, "rerender", {tools});
}


export function listener<T extends any>(this: T, eventName: string, f: <E extends Event> (e:E)=>void){
  return {
    name: eventName,
    listener: f.bind(this)
  }
}

///**
// * attach an event listner to the given target
// */
//
//// this needs an adjustement because xhen called previous event-listners are not removed 
//// then the new one is attach meaning when we attach a 'somehow' the old one is automatically
//// removed.
//export function attach<T extends EventTarget>( this: T, eventListener: ReturnType< typeof listener>){
//  this.addEventListener(eventListener.name, eventListener.listener)
//}

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
  events: {[key: string]: ReturnType<typeof listener>["listener"]}

  constructor(toolbar: Toolbar, renderer: Renderer, app: DrawQuestApp ){
    this.toolbar = toolbar;
    this.renderer = renderer;
    this.app = app;
    this.currentMode = new Mode("selection")
    this.events = {}
  }

  attachCanvasEventListener(r: ReturnType<typeof listener>){
    // guard against incorrect use (event name not a native DOM event)
    if(this.events[r.name]){
      this.app.canvas.removeEventListener(r.name, this.events[r.name])
    } 
    this.events[r.name] = r.listener;
    this.app.canvas.addEventListener(r.name, r.listener)
  }

  bindListener(){
    return listener.bind(this)
  }

  attachTargetEventListener<T extends EventTarget & {events: Map<string, ReturnType<typeof listener>["listener"]>}>(target: T, r: ReturnType<typeof listener>){
    if(target.events.get(r.name)) {
      target.removeEventListener(r.name, target.events.get(r.name) ?? null);// used null so TS compiler would shut the fuck up
    }
    target.events.set(r.name ,r.listener);
    target.addEventListener(r.name, r.listener);
  }

  bindTargetListener<T extends EventTarget & {events: {[key: string]: ReturnType<typeof listener>["listener"]}}>(target: T ){
    return listener.bind(target);
  }
}


/**
 * events:                          listeners:
 *        - addObject         [X]             []
 *        - updateObject      [X]             []
 *        - removeObject      [X]             []
 *        - selectObject      [X]             []
 *        - highlightObject   [X]             []
 *        - resizeObject      [X]             []
 *        - customizeObject   [X]             []
 *        - addToRange        [X]             []
 *        - removeFromRange   [X]             []
 *        - resizeRange       [X]             []
 *        - selectTool        [X]             []
 * */


// event functions

// event listner functions should be changed to normal anonymous functions
// should only be used with call

/**
 * adds an object to the objects array in the renderer
 */
export function addObject<F extends Tool<any>>(this: F, f:<T>(this: F,e: MouseEvent)=>undefined|T){
  const boundF = f.bind(this)
  let listener =function  <T extends Manager>(this:T, e:MouseEvent) {
    // boundF is already perminatly bound to type F before it's used inside 
    // the listener's 'this' context so it should be safe to use it this way
    //@ts-ignore
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

export function updateObject<F extends Tool<any>>(this: F, f:<T>(this: F,e: MouseEvent)=>undefined|T){
  const boundF = f.bind(this)

  let listener =function  <T extends Manager>(this:T, e:MouseEvent) {
    // boundF is already perminatly bound to type F before it's used inside 
    // the listener's 'this' context so it should be safe to use it this way
    //@ts-ignore
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

export function removeObject<F extends Tool<any>>(this: F, f:<T>(this: F,e: MouseEvent)=>undefined|T){
  const boundF = f.bind(this)

  let listener =function  <T extends Manager>(this:T, e:MouseEvent) {
    // boundF is already perminatly bound to type F before it's used inside 
    // the listener's 'this' context so it should be safe to use it this way
    //@ts-ignore
    let object = boundF(e);
    if(object) {
      event.call(this.renderer, "remove-object", {detail: {object}})
      requestRerender(this.renderer, this.toolbar.tools)
    }else {
      console.error("Object not returned")
    }
  }

  return listener;
}

export function selectObject<F extends Tool<any>>(this: F, f:<T>(this: F, e: MouseEvent)=>undefined|T){
  const boundF = f.bind(this)

  let listener =function  <T extends Manager>(this:T, e:MouseEvent) {
    // boundF is already perminatly bound to type F before it's used inside 
    // the listener's 'this' context so it should be safe to use it this way
    //@ts-ignore
    let object = boundF(e);
    if(object) {
      event.call(this.renderer, "select-object", {detail: {object}})
      requestRerender(this.renderer, this.toolbar.tools)
    }else {
      console.error("Object not returned")
    }
  }

  return listener;
}

export function highlightObject<F extends Tool<any>>(this: F, f:<T>(this: F, e: MouseEvent)=>undefined|T){
  const boundF = f.bind(this)

  let listener =function  <M extends Manager>(this:M, e:MouseEvent) {
    // boundF is already perminatly bound to type F before it's used inside 
    // the listener's 'this' context so it should be safe to use it this way
    //@ts-ignore
    let object = boundF(e);
    if(object) {
      event.call(this.renderer, "highlight-object", {detail: {object}})
      requestRerender(this.renderer, this.toolbar.tools)
    }else {
      console.error("Object not returned")
    }
  }

  return listener;
}

export function resizeObject < F extends Tool<any> > ( this: F, f: <T> (this: F,e: MouseEvent) =>undefined|T ){
  const boundF = f.bind(this)

  let listener =function  <M extends Manager>(this:M, e:MouseEvent) {
    // boundF is already perminatly bound to type F before it's used inside 
    // the listener's 'this' context so it should be safe to use it this way
    //@ts-ignore
    let object = boundF(e);
    if(object) {
      event.call(this.renderer, "resize-object", {detail: {object}})
      requestRerender(this.renderer, this.toolbar.tools)
    }else {
      console.error("Object not returned")
    }
  }

  return listener;
}

export function customizeObject< F extends Tool<any> > ( this: F, f: <T> (this: F, e: MouseEvent) =>undefined|T ) {
  const boundF = f.bind(this)

  let listener =function  <M extends Manager>(this:M, e:MouseEvent) {
    // boundF is already perminatly bound to type F before it's used inside 
    // the listener's 'this' context so it should be safe to use it this way
    //@ts-ignore
    let object = boundF(e);
    if(object) {
      event.call(this.renderer, "customize-object", {detail: {object}})
      requestRerender(this.renderer, this.toolbar.tools)
    }else {
      console.error("Object not returned")
    }
  }

  return listener;
}

export function addToRange< F extends Tool<any> > ( this: F, f: <T> (this: F,e: MouseEvent) =>undefined|T ) {
  const boundF = f.bind(this)

  let listener =function  <M extends Manager>(this:M, e:MouseEvent) {
    // boundF is already perminatly bound to type F before it's used inside 
    // the listener's 'this' context so it should be safe to use it this way
    //@ts-ignore
    let object = boundF(e);
    if(object) {
      event.call(this.renderer, "add-object-to-range", {detail: {object}})
      requestRerender(this.renderer, this.toolbar.tools)
    }else {
      console.error("Object not returned")
    }
  }

  return listener;
} 

export function removeFromRange< F extends Tool<any> > ( this: F, f: <T> (this: F, e: MouseEvent) => undefined|T ) {
  const boundF = f.bind(this)

  let listener =function  <M extends Manager>(this:M, e:MouseEvent) {
    // boundF is already perminatly bound to type F before it's used inside 
    // the listener's 'this' context so it should be safe to use it this way
    //@ts-ignore
    let object = boundF(e);
    if(object) {
      event.call(this.renderer, "remove-object-from-range", {detail: {object}})
      requestRerender(this.renderer, this.toolbar.tools)
    }else {
      console.error("Object not returned")
    }
  }

  return listener;
}

export function resizeRange< F extends Tool<any> > ( this: F, f: <T extends QuestShape> (this: F, e: MouseEvent) => undefined|T ) {
  const boundF = f.bind(this)

  let listener =function  <M extends Manager>(this:M, e:MouseEvent) {
    // boundF is already perminatly bound to type F before it's used inside 
    // the listener's 'this' context so it should be safe to use it this way
    //@ts-ignore
    let object = boundF(e);
    if(object) {
      event.call(this.renderer, "remove-object-from-range", {detail: {object}})
      requestRerender(this.renderer, this.toolbar.tools)
    }else {
      console.error("Object not returned")
    }
  }

  return listener;
}

export function selectTool< F extends Toolbar >( this: F, f: <T extends Tool<any>> (this: F, e: MouseEvent) => T ) {
  const boundF = f.bind(this);
  let listener = function  <M extends Manager>(this:M, e:MouseEvent) {
    // boundF is already perminatly bound to type F before it's used inside 
    // the listener's 'this' context so it should be safe to use it this way
    //@ts-ignore
    let tool = boundF(e);
    event.call(this.app, "attach-tool", {detail: {tool}})
  }
  return listener
}


