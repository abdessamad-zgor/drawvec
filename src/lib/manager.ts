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
import { QuestShape, RangeMargin, Tool } from "./utils";
import { QuestEvent, Toolbar, Tools, ToolsType } from "./tools/index";

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


export function listener<T extends any>(this: T, eventName: string, f: <D=void> (e: QuestEvent<D>)=>void) {
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
export class Manager extends EventTarget {
  toolbar: Toolbar;
  renderer: Renderer;
  canvas: HTMLCanvasElement;
  currentMode: Mode;
  // register events that the EventTarget listen to 
  events: Map<string, ReturnType<typeof listener>["listener"]>

  constructor(toolbar: Toolbar, renderer: Renderer, canvas: HTMLCanvasElement ){
    super();
    this.toolbar = toolbar;
    this.renderer = renderer;
    this.canvas = canvas;
    this.currentMode = new Mode("selection")
    this.events = new Map();
  }

  attachCanvasEventListener(r: ReturnType<typeof listener>){
    // guard against incorrect use (event name not a native DOM event)
    if(this.events.has(r.name)){
      //@ts-ignore
      this.canvas.removeEventListener(r.name, this.events.get(r.name));
    } 
    this.events.set(r.name, r.listener);
    //@ts-ignore
    this.canvas.addEventListener(r.name, r.listener);
  }

  bindListener(fListner: typeof listener){
    return fListner.bind(this);
  }

  attachTargetEventListener<T extends EventTarget & {events: Map<string, ReturnType<typeof listener>["listener"]>}>
  (target: T, r: ReturnType<typeof listener>)
  {
    if(target.events.get(r.name)) {
      //@ts-ignore
      target.removeEventListener(r.name, target.events.get(r.name) ?? null);// used null so TS compiler would shut the fuck up
    }
    target.events.set(r.name ,r.listener);
    //@ts-ignore
    target.addEventListener(r.name, r.listener);
  }

  bindTargetListener <T extends EventTarget & {events: Map<string, ReturnType<typeof listener>["listener"]>}>
  (target: T, fListener: typeof listener )
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


// event functions

// event listner functions should be changed to normal anonymous functions
// should only be used with call

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

export function selectTool< F extends Toolbar >( this: F, f: <Q extends QuestShape, T extends Tool<Q>> (this: F, e: MouseEvent) => ToolsType ) {
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
