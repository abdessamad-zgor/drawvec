// src/utils.ts
var genrateRef = function() {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 6) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};
function UpdateShape(e, q) {
  let start = { x: q._coords.x, y: q._coords.y };
  let end = { x: q._coords.x + q._coords.width, y: q._coords.y + q._coords.height };
  if (e.clientX < start.x && e.clientY > start.y) {
    start.x = e.clientX;
    end.x = q._coords.original.x;
  } else if (e.clientX > start.x && e.clientY < start.y) {
    start.y = e.clientY;
    end.y = q._coords.original.y;
  } else if (end.x < start.x && end.y < start.y) {
    start = { x: e.clientX, y: e.clientY };
    end = q._coords.original;
  }
  q._coords.x = start.x;
  q._coords.y = start.y;
  q._coords.width = Math.abs(start.x - end.x);
  q._coords.height = Math.abs(start.y - end.y);
  return q;
}
function drawRectangle(q) {
  this.beginPath();
  this.rect(q._coords.x, q._coords.y, q._coords.width, q._coords.height);
  this.stroke();
}
function drawEllipse(q) {
  let center = q.center();
  this.beginPath();
  this.ellipse(center.x, center.y, q.radiusX(), q.radiusY(), 0, 0, Math.PI * 2);
  this.stroke();
}
function createRectangle(e) {
  return {
    ref: genrateRef(),
    type: "rectangle",
    _coords: {
      original: {
        x: e.clientX,
        y: e.clientY
      },
      x: e.clientX,
      y: e.clientY,
      width: 1,
      height: 1
    }
  };
}
function createEllipse(e) {
  return {
    ref: genrateRef(),
    type: "ellipse",
    _coords: {
      original: {
        x: e.clientX,
        y: e.clientY
      },
      x: e.clientX,
      y: e.clientY,
      width: 2,
      height: 2
    },
    center: function() {
      return { x: this._coords.x + this._coords.width / 2, y: this._coords.y + this._coords.height / 2 };
    },
    radiusX: function() {
      return this._coords.width / 2;
    },
    radiusY: function() {
      return this._coords.height / 2;
    }
  };
}
function createQuestShape(selectedTool, e) {
  switch (selectedTool) {
    case QUEST_rectangle:
      return createRectangle(e);
    case QUEST_ellipse:
      return createEllipse(e);
    default:
      return {};
  }
}
var QUEST_rectangle = "rectangle";
var QUEST_ellipse = "ellipse";

// src/rendrer.ts
class Rendrer extends EventTarget {
  _QuestContext;
  canvas;
  constructor(canvas) {
    super();
    this.canvas = canvas;
    this._QuestContext = canvas.getContext("2d");
  }
  draw(objects) {
    for (let shape of objects) {
      switch (shape.type) {
        case QUEST_ellipse:
          drawEllipse.call(this._QuestContext, shape);
        case QUEST_rectangle:
          drawRectangle.call(this._QuestContext, shape);
      }
    }
    let canvasImage = this._QuestContext.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this._QuestContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._QuestContext.putImageData(canvasImage, 0, 0);
  }
  listenForChanges() {
    this.addEventListener("draw", (e) => {
      this.draw(e.detail.objects);
    });
  }
}

// src/main.ts
class DrawQuestApp {
  activelyChanged = null;
  selectedTool = QUEST_ellipse;
  canvas;
  rendrer;
  objects = [];
  constructor(canvasId) {
    let canvas = document.getElementById(canvasId);
    if (canvas)
      this.canvas = canvas;
    else
      throw Error("no Canvas element with id: " + canvasId + ".");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.rendrer = new Rendrer(this.canvas);
  }
  initialize() {
    this.canvas.onmousedown = (e) => {
      if (this.selectedTool == QUEST_rectangle || this.selectedTool == QUEST_ellipse) {
        this.activelyChanged = createQuestShape(this.selectedTool, e);
        this.objects = [...this.objects, this.activelyChanged];
        this.render();
      }
    };
    this.canvas.onmousemove = (e) => {
      if (this.activelyChanged) {
        console.log(e.movementX);
        this.activelyChanged = UpdateShape(e, this.activelyChanged);
        this.objects[this.objects.findIndex((el) => el.ref == el.ref)] = this.activelyChanged;
        this.render();
      }
    };
    this.canvas.onmouseup = (e) => {
      if (this.activelyChanged) {
        this.activelyChanged = UpdateShape(e, this.activelyChanged);
        this.objects[this.objects.findIndex((el) => el.ref == el.ref)] = this.activelyChanged;
        this.render();
      }
      this.activelyChanged = null;
    };
    this.rendrer.listenForChanges();
  }
  render() {
    let drawEvent = new CustomEvent("draw", { detail: { objects: this.objects } });
    this.rendrer.dispatchEvent(drawEvent);
  }
}

// index.ts
var app = new DrawQuestApp("drawquest");
app.initialize();
