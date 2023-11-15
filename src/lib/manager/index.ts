import { Renderer } from "../renderer";
import { QuestShape, RangeMargin, Tool } from "../utils";
import { QuestEvent, Toolbar, Tools, ToolsType } from "../tools/index";
import { DrawQuestApp } from "../../main";

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
export function requestRerender(target: Renderer, tools: Toolbar["tools"]) {
  event.call(target, "rerender", {tools});
}

type Listener<T = EventTarget, Q = QuestEvent> = (this:T, e: Q) => void

/**
 * a manager that holds the refs of all the the other components, 
 * manages the events, modes and binds the function's this 
**/ 
export class Manager extends EventTarget {
  toolbar: Toolbar;
  renderer: Renderer;

  app: DrawQuestApp

  // register events that the EventTarget listen to 
  events: Map<string, Map<string, Listener>>

  constructor(toolbar: Toolbar, renderer: Renderer, app: DrawQuestApp ){
    super();
    this.toolbar = toolbar;
    this.renderer = renderer;
    this.app = app;
    this.events = new Map();
  }

  attachCanvasEventListener(listener: Listener, name: string){
    let canvasListeners = this.events.get("canvas");
    // guard against incorrect use (event name not a native DOM event)
    if(canvasListeners?.has(name)){
      //@ts-ignore
      this.app.canvas.removeEventListener(name, canvasListeners.get(name));
    } 
    canvasListeners?.set(name, listener);
    //@ts-ignore
    this.app.canvas.addEventListener(name, listener);
  }

  bindListener(fListner: Listener): Listener<Manager>{
    return fListner.bind(this);
  }

  attachTargetEventListener<T extends EventTarget & {name: string}>
  (target: T, listener: Listener, name: string)
  {
    let targetListeners = this.events.get(target.name);
    if(targetListeners?.get(name)) {
      //@ts-ignore
      target.removeEventListener(name, targetListeners.get(name) ?? null);// used null so TS compiler would shut the fuck up
    }
    targetListeners?.set(name ,listener as Listener);
    //@ts-ignore
    target.addEventListener(name, listener);
  }

  bindTargetListener <T extends EventTarget & {name: string}>
  (target: T, fListener: Listener): Listener<T>
  {
    return fListener.bind(target);
  }
}
/**
 * events:                          listeners:
 *        - addObject         [X]             [X]
 *        - updateObject      [X]             [X]
 *        - removeObject      [X]             [X]
 *        - selectObject      [X]             [X]
 *        - highlightObject   [X]             []
 *        - resizeObject      [X]             []
 *        - customizeObject   [X]             []
 *        - addToRange        [X]             []
 *        - removeFromRange   [X]             []
 *        - resizeRange       [X]             []
 *        - selectTool        [X]             []
 * */

/**
 * adds an object to the objects array in the renderer
 */
export function addObject<Q extends QuestShape, T>(this: Tools<T>, f:( this: Tools<T>, e: MouseEvent)=>undefined|Q){
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

export function updateObject<Q extends QuestShape, T>(this: Tools <T>, f:(this: Tools <T>,e: MouseEvent)=>undefined|Q){
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

export function removeObject<Q extends QuestShape, T>(this: Tools<T>, f: (this: Tools<T>, e: MouseEvent)=>undefined|Q){
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

export function selectObject<Q extends QuestShape, F extends ToolsType>(this: F, f:( e: MouseEvent)=>undefined|Q){
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

export function highlightObject<Q extends QuestShape, F extends ToolsType>(this: F, f:( e: MouseEvent)=>undefined|Q){
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

export function resizeObject <Q extends QuestShape,  F extends ToolsType> ( this: F, f: (this: F,e: MouseEvent) =>undefined|Q ){
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

export function customizeObject<Q extends QuestShape,  F extends ToolsType> ( this: F, f: (this: F, e: MouseEvent) =>undefined|Q ) {
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

export function addToRange<  Q extends QuestShape,  F extends ToolsType> ( this: F, f: (this: F,e: MouseEvent) =>undefined|Q ) {
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

export function removeFromRange<Q extends QuestShape, F extends ToolsType> ( this: F, f: <T> (this: F, e: MouseEvent) => undefined|Q ) {
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

export function resizeRange<Q extends QuestShape, F extends ToolsType> ( this: F, f: <T extends QuestShape> (this: F, e: MouseEvent) => undefined|Q ) {
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

export function selectTool< F extends Toolbar >( this: F, f: <Q extends QuestShape, T extends Tool<Q>> (this: F, e: MouseEvent) => ToolsType ):Listener<Manager,MouseEvent> {
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

export function addObjectListener (this: Renderer, e:CustomEvent<{object: QuestShape}>) {
  let o = e.detail.object;
  if (o){
    if(!this.objects.map(o=>o.ref).includes(o.ref)){
      this.objects = [...this.objects, o]
    } else console.error("Object of ref "+o.ref+" cannot be added twice to the array. Remove duplicate insertions.")
  } else console.error("Object not found! Check event dispatch invocation.")
}


export function updateObjectListener (this: Renderer, e: CustomEvent<{object: QuestShape}>) {
  let o = e.detail.object
  if(o){
    let oIndex = this.objects.findIndex(v=>v.ref==o.ref);
    if(oIndex>=0){
      this.objects[oIndex] = o;
    } else console.error("No object with ref "+ o.ref +" check addObjectListener impelementation.");
  } else console.error("Object not found! Check event dispatch invocation.")
}

export function removeObjectListener (this: Renderer, e: CustomEvent<{object: QuestShape}>) {
  let o = e.detail.object;
  if (o) {
    let oIndex = this.objects.findIndex(v=>v.ref==o.ref);
    if(oIndex>=0){
      this.objects = this.objects.filter(v=>v.ref!=o.ref);
    } else console.error("No object found with ref "+o.ref+" check event dispatch invocation.");
  } else console.error("Object not found! Check event dispatch invocation.")
}

export function selectObjectListener (this: Renderer, e: CustomEvent<{object: QuestShape}>) {
  let o = e.detail.object;
  // In SelectionTool when an object is selected a new selection rectangle is created and inserted in the objects array
  if (o) {
    let oIndex = this.objects.findIndex(v=>v.ref!=o.ref);
    if(oIndex>=0) {
      let oSelection: QuestShape = {
        ...o,
        ref: o.ref+"-selection-rect",
        type: "rectangle",
        _coords: [
          [o._coords[0][0]-RangeMargin, o._coords[0][1]-RangeMargin],
          [o._coords[1][0]+RangeMargin, o._coords[1][1]-RangeMargin],
          [o._coords[2][0]+RangeMargin, o._coords[2][1]+RangeMargin],
          [o._coords[3][0]-RangeMargin, o._coords[3][1]+RangeMargin]
        ],
      }
    }
  }
}
