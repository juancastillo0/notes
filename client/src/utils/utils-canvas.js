export const cursors = {
  draw: "url('assets/5_objects.png') 6 5, auto",
  erase: "url('assets/eraser-black-sm.png') 3 22, auto",
  move: "move",
  select: "default"
};

export function itemBushFromPath(path) {
  const { x, y, height, width } = path.getInternalBounds();
  const bushItem = {
    minX: x,
    minY: y,
    maxX: x + width,
    maxY: y + height,
    path: path
  };
  return bushItem;
}

export function getCanvasFunctions({ canvasMenu }) {
  let canShowMenu;
  /** Canvas menu shown on click*/
  function showMenu(event) {
    if (!canShowMenu) return;
    const {pageX:x, pageY:y} = event;
    canvasMenu.style.display = "block";
    const box = canvasMenu.getBoundingClientRect();
    canvasMenu.style.left = `${Math.min(
      Math.max(x - box.width / 2, 25),
      window.innerWidth - box.width - 40
    )}px`;
    canvasMenu.style.top = `${Math.min(
      Math.max(y - box.height * 2, 20),
      window.innerHeight - box.height - 50
    )}px`;
  }

  function hideMenu() {
    if (canvasMenu.style.display !== "none") {
      canvasMenu.style.display = "none";
      canShowMenu = false;
    } else {
      canShowMenu = true;
    }
  }

  return { showMenu, hideMenu };
}
