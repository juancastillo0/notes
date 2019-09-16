/* eslint-disable indent */
import { itemBushFromPath } from "./utils-canvas";
import { rFilter } from "./utils-io";
import { cursors } from "./utils-canvas";

export const SELECTED_COLOR = "rgb(0,150,250)";
export const RECT_COLOR = "#ccc";
export function getAllTools({
  paper,
  addPath,
  removePath,
  pastePath,
  hideMenu,
  showMenu,
  bush,
  defaultStrokeColor,
  canvasUploadImage,
  canvasScroll,
  canvas
}) {
  const tools = {};

  /** Select tool */
  function getSelectHandlers() {
    let from = new paper.Point(-1000, -1000);
    let rect = new paper.Path.Rectangle(from, from);
    let state = "selecting"; // moving, selecting, resizing
    let selectedPaths = [];
    const tolerance = 6;
    let prevScale = 1;

    let copiedPaths;
    let copiedRect;

    function rectSizeIsValid() {
      if (rect) {
        const { width, height } = rect.getInternalBounds();
        return width >= 3 && height >= 3;
      }
      return false;
    }
    function cloneSelectedPaths() {
      document.addEventListener("paste", handlePaste);
      if (copiedRect !== undefined) {
        copiedRect.remove();
      }
      if (copiedPaths !== undefined) {
        copiedPaths.forEach(p => p.remove());
      }
      if (!rect) return;

      copiedRect = rect.clone();
      copiedRect.visible = false;

      copiedPaths = selectedPaths.map(p => {
        const newPath = p.path.clone();
        newPath.data.oldId = p.id;
        newPath.visible = false;
        return newPath;
      });
    }
    function handlePaste(event) {
      console.log("paste");
      const files = event.clipboardData.files;
      const prevTimestamp = canvasUploadImage.getAttribute("data-timestamp");
      const prevFilename = canvasUploadImage.getAttribute("data-filename");
      console.log(
        prevTimestamp,
        prevFilename,
        files.length > 0 && files[0].fileName
      );

      if (
        !(
          files.length > 0 &&
          rFilter.test(files[0].type) &&
          (prevTimestamp === null ||
            (prevFilename === files[0].fileName &&
              Date.now() - parseInt(prevTimestamp) < 1000)) &&
          copiedRect !== undefined &&
          selectedPaths !== undefined
        )
      ) {
        const { x, y } = rect.getInternalBounds();
        const {
          x: xPrev,
          y: yPrev,
          width,
          height
        } = copiedRect.getInternalBounds();
        selectedPaths = copiedPaths.map(p => {
          p.position.x = x + p.position.x - xPrev - width / 2;
          p.position.y = y + p.position.y - yPrev - height / 2;
          p.visible = true;
          pastePath(p, p.data.oldId);
          return itemBushFromPath(p);
        });
        copiedPaths = undefined;

        rect = copiedRect;
        rect.visible = true;
        rect.position.x = x;
        rect.position.y = y;

        copiedRect = undefined;
        cloneSelectedPaths();
      }
    }
    function handleCut(event) {
      console.log("cut");
      cloneSelectedPaths();
      selectedPaths.forEach(p => {
        removePath(p);
      });
      rect.remove();
      event.preventDefault();
    }
    function handleCopy(event) {
      console.log("copy");
      cloneSelectedPaths();
      event.preventDefault();
    }
    function reloadSelectedPaths() {
      const newPaths = [];
      selectedPaths.forEach(p => {
        bush.remove(p);
        newPaths.push(itemBushFromPath(p.path));
      });
      bush.load(newPaths);
      selectedPaths = newPaths;
    }
    function drawRect(from, to) {
      rect.remove();
      rect = new paper.Path.Rectangle(from, to);
      rect.strokeColor = RECT_COLOR;
      rect.dashArray = [5, 2];
    }
    function onMouseDown(event) {
      if (rectSizeIsValid()) {
        if (
          rect.hitTest(event.point, { segments: true, tolerance: tolerance })
        ) {
          state = "resizing";
          rect.data.bounds = rect.bounds.clone();
          rect.data.scaleBase = event.point.subtract(rect.bounds.center);
          return;
        }
        if (rect.contains(event.point)) {
          state = "moving";
          return;
        }
      }
      if (selectedPaths.length > 0) {
        document.removeEventListener("copy", handleCopy);
        document.removeEventListener("cut", handleCut);
      }
      rect.remove();

      state = "selecting";
      selectedPaths.forEach(p => (p.path.strokeColor = defaultStrokeColor()));
      from = event.point;
      rect = new paper.Path.Rectangle(from, event.point);
      hideMenu();
    }
    function onMouseDrag(event) {
      switch (state) {
        case "moving": {
          const delta = event.point.subtract(event.lastPoint);
          rect.position = rect.position.add(delta);
          selectedPaths.forEach(p => {
            p.path.position = p.path.position.add(delta);
          });
          break;
        }
        case "resizing": {
          const bounds = rect.data.bounds;
          const scale =
            event.point.subtract(bounds.center).length /
            rect.data.scaleBase.length;

          const newScale = scale / prevScale;
          rect.scale(newScale);
          selectedPaths.forEach(p => {
            p.path.scale(newScale, bounds.center);
          });
          prevScale = scale;
          break;
        }
        case "selecting":
          drawRect(from, event.point);
          break;
      }
    }
    function onMouseUp(event) {
      switch (state) {
        case "moving": {
          reloadSelectedPaths();
          break;
        }
        case "resizing": {
          reloadSelectedPaths();
          prevScale = 1;
          break;
        }
        case "selecting": {
          const rectRect = rect.getInternalBounds();
          const { x, y, width, height } = rectRect;
          if (width < 3 || height < 3) {
            const { x, y } = event.point;
            const tolerancePointSelect = 4;
            const nearPaths = bush
              .search({
                minX: x - tolerancePointSelect,
                minY: y - tolerancePointSelect,
                maxX: x + tolerancePointSelect,
                maxY: y + tolerancePointSelect
              })
              .filter(p => {
                const ht = p.path.hitTest(event.point, {
                  segments: true,
                  stroke: true,
                  tolerance: tolerancePointSelect
                });
                return ht;
              });
            if (nearPaths.length > 0) {
              const selectedPath = nearPaths[0];
              selectedPath.path.strokeColor = SELECTED_COLOR;
              selectedPaths = [selectedPath];
              const { minX, minY, maxX, maxY } = selectedPath;
              drawRect(
                new paper.Point(minX, minY),
                new paper.Point(maxX, maxY)
              );
            } else {
              showMenu(event.event, event.event);
            }
          } else {
            selectedPaths = bush.search({
              minX: x,
              minY: y,
              maxX: x + width,
              maxY: y + height
            });
            window.selectedPaths = selectedPaths;
            selectedPaths = selectedPaths
              .filter(p => {
                const pathRect = p.path.getInternalBounds();
                pathRect.height += 1;
                pathRect.width += 1;
                const percentIntersect =
                  pathRect.intersect(rectRect).area / pathRect.area;
                return percentIntersect > 0.7;
              })
              .map(p => {
                p.path.strokeColor = SELECTED_COLOR;
                return p;
              });
          }
          if (selectedPaths.length == 0) {
            rect.remove();
            rect = new paper.Path.Rectangle(from, from);
          } else {
            document.addEventListener("copy", handleCopy);
            document.addEventListener("cut", handleCut);
          }
          break;
        }
      }
    }
    function onMouseMove(event) {
      if (rect) {
        const { width, height } = rect.getInternalBounds();
        if (width >= 3 && height >= 3) {
          if (
            rect.hitTest(event.point, { segments: true, tolerance: tolerance })
          ) {
            const center = rect.bounds.center;
            const point = event.point;
            if (center.x > point.x) {
              if (center.y > point.y) {
                canvas.style.cursor = "se-resize";
              } else {
                canvas.style.cursor = "ne-resize";
              }
            } else {
              if (center.y > point.y) {
                canvas.style.cursor = "ne-resize";
              } else {
                canvas.style.cursor = "se-resize";
              }
            }
            return;
          } else if (rect && rect.contains(event.point)) {
            canvas.style.cursor = cursors["move"];
            return;
          }
        }
      }
      canvas.style.cursor = cursors["select"];
    }

    return { onMouseDown, onMouseDrag, onMouseUp, onMouseMove };
  }
  /** Initialize select tool */
  tools["select"] = new paper.Tool();
  const selectTool = tools["select"];
  const selectHandlers = getSelectHandlers();
  selectTool.onMouseDown = selectHandlers.onMouseDown;
  selectTool.onMouseDrag = selectHandlers.onMouseDrag;
  selectTool.onMouseUp = selectHandlers.onMouseUp;
  selectTool.onMouseMove = selectHandlers.onMouseMove;

  /** Eraser tool */
  function getEraseHandlers() {
    let path;
    function onMouseDown(event) {
      path = new paper.Path();
      path.add(event.point);
      hideMenu();
    }
    function onMouseDrag(event) {
      path.add(event.point);
      const { x, y } = event.point;
      const { x: x2, y: y2 } = event.lastPoint;
      const bushPaths = bush.search({
        minX: Math.min(x, x2),
        minY: Math.min(y, y2),
        maxX: Math.max(x, x2),
        maxY: Math.max(y, y2)
      });
      bushPaths.forEach(p => {
        if (p.path.intersects(path)) {
          removePath(p);
        }
      });
    }
    function onMouseUp(event) {
      if (path.length <= 3) {
        showMenu(event.event, event.event);
      }
    }
    return { onMouseDown, onMouseDrag, onMouseUp };
  }
  /** Initialize erase tool */
  tools["erase"] = new paper.Tool();
  const eraseTool = tools["erase"];
  const eraseHandlders = getEraseHandlers();
  eraseTool.onMouseDown = eraseHandlders.onMouseDown;
  eraseTool.onMouseDrag = eraseHandlders.onMouseDrag;
  eraseTool.onMouseUp = eraseHandlders.onMouseUp;

  /** Drawing tool */
  function getDrawHandlers() {
    let path;
    let pathSave;
    function onMouseDown(event) {
      path = new paper.Path({
        strokeColor: defaultStrokeColor(),
        strokeWidth: 1.5,
        strokeCap: "round",
        strokeJoin: "round"
      });
      path.add(event.point);
      pathSave = {
        t: [new Date().getTime()],
        x: [event.point.x],
        y: [event.point.y]
      };
      hideMenu();
    }
    function onMouseDrag(event) {
      path.add(event.point);
      pathSave["t"].push(new Date().getTime());
      pathSave["x"].push(event.point.x);
      pathSave["y"].push(event.point.y);
    }
    function onMouseUp(event) {
      if (path.length > 3) {
        addPath(path, pathSave);
      } else {
        path.remove();
        showMenu(event.event, event.event);
      }
    }
    return { onMouseDown, onMouseDrag, onMouseUp };
  }
  /** Initialize drawing tool */
  tools["draw"] = new paper.Tool();
  const drawTool = tools["draw"];
  const drawHandlers = getDrawHandlers();
  drawTool.onMouseDown = drawHandlers.onMouseDown;
  drawTool.onMouseDrag = drawHandlers.onMouseDrag;
  drawTool.onMouseUp = drawHandlers.onMouseUp;
  drawTool.activate();

  /** Drag canvas with move tool */
  function updateScrollPosition(click, event) {
    canvasScroll().scrollTo(click[0] - event.pageX, click[1] - event.pageY);
  }
  /** Move tool configuration */
  function MoveMouseHandlers() {
    let click = false;
    let isDragging = false;

    const onMouseDownMove = function(event) {
      click = [
        event.pageX + canvasScroll().scrollLeft,
        event.pageY + canvasScroll().scrollTop
      ];
      hideMenu();
    };
    const onMouseMoveMove = function(event) {
      if (click) {
        updateScrollPosition(click, event);
        isDragging = true;
      }
    };
    const onMouseUpMove = function(event) {
      if (!isDragging) {
        showMenu(event, event);
      }
      click = false;
      isDragging = false;
    };

    return {
      mousedown: onMouseDownMove,
      mousemove: onMouseMoveMove,
      mouseup: onMouseUpMove
    };
  }

  const moveHandlers = MoveMouseHandlers();

  /** Add move tool event listeners */
  function addMoveHandlers() {
    const _canvasScroll = document.getElementById("canvas-scroll");
    Object.entries(moveHandlers).forEach(([eventType, handler]) => {
      _canvasScroll.addEventListener(eventType, handler);
    });
  }
  /** Remove move tool event listeners */
  function removeMoveHandlers() {
    const _canvasScroll = document.getElementById("canvas-scroll");
    Object.entries(moveHandlers).forEach(([eventType, handler]) => {
      _canvasScroll.removeEventListener(eventType, handler);
    });
  }

  /** Initialize move tool */
  tools["move"] = new paper.Tool();
  tools["move"].onActivate = () => {
    addMoveHandlers();
  };
  tools["move"].onDeactivate = () => {
    removeMoveHandlers();
  };

  /** Pen tool */
  function getPenHandlers(pointerDownEvent) {
    let type; // mouse, pen or touch
    let handlers;
    const dummyTool = new paper.Tool();
    dummyTool.onActivate = () => {
      canvas.addEventListener("pointerdown", onPointerDown);
    };
    dummyTool.onDeactivate = () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
    };

    function getPaperEvent(event) {
      return {
        event,
        point: new paper.Point(event.offsetX, event.offsetY)
      };
    }

    function onPointerDown(event) {
      type = event.pointerType;

      switch (type) {
        case "mouse":
          handlers = selectHandlers;
          break;
        case "pen":
          if (event.button === 5 && event.buttons === 32) {
            handlers = eraseHandlders;
          } else {
            handlers = drawHandlers;
          }
          break;
        case "touch":
          if (!dummyTool.isActive()) {
            dummyTool.activate();
          }
          return;
      }
      if (dummyTool.isActive()) {
        drawTool.activate();
      }

      const paperEvent = getPaperEvent(event);
      handlers.onMouseDown(paperEvent);
    }

    function onMouseDrag(event) {
      handlers.onMouseDrag(event);
    }

    function onMouseUp(event) {
      handlers.onMouseUp(event);
    }

    function onMouseMove(event) {
      if (handlers.onMouseMove) handlers.onMouseMove(event);
    }

    onPointerDown(pointerDownEvent);
    return { onPointerDown, onMouseDrag, onMouseUp, onMouseMove };
  }

  return { tools, getPenHandlers, addMoveHandlers, removeMoveHandlers };
}
