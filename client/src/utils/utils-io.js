import store, {importCanvas } from "../services/store";

export const rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
/*
function loadImageIntoCanvas(file) {
  const canvasUploadImage = document.getElementById("canvas-upload-image");
  if (!rFilter.test(file.type)) {
    window.alert("Debes seleccionar un archivo de imagen válido.");
    return;
  }

  const fileReader = new FileReader();
  fileReader.onload = () => {
    if (canvasUploadImage.src !== fileReader.result) {
      canvasUploadImage.setAttribute("data-timestamp", Date.now().toString());
    }
    canvasUploadImage.src = fileReader.result;
    canvasUploadImage.setAttribute("data-filename", file.fileName);

    const raster = new paper.Raster("canvas-upload-image");
    const {
      width: canvasW,
      height: canvasH
    } = canvasScroll.getBoundingClientRect();
    raster.position.x = canvasScroll.scrollLeft + canvasW / 2;
    raster.position.y = canvasScroll.scrollTop + canvasH / 2;
  };

  fileReader.readAsDataURL(file);
}
export function handleDropFile(event) {
  event.stopPropagation();
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  loadImageIntoCanvas(file);
}
export function handleDragOver(event) {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
}
export function handlePasteImage(event) {
  const files = event.clipboardData.files;
  if (files.length > 0 && rFilter.test(files[0].type)) {
    loadImageIntoCanvas(files[0]) ;
  }
}
*/


export function importData(event) {
  const file = event.target.files[0];
  if (file.type !== "application/json") {
    window.alert(
      "Debes seleccionar un archivo válido, la extensión debe ser '.json'."
    );
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    const jsonParsed = JSON.parse(e.target.result);
    console.log(jsonParsed);
    store.dispatch(importCanvas(jsonParsed));
  };
  reader.readAsText(file);
}


export function writeData(data, paper, addPath) {
  data.paths.forEach(dataPath => {
    const { x, y, t } = dataPath;
    const path = new paper.Path();
    path.strokeColor = "black";
    for (let i = 0; i < x.length; i++) {
      path.add(new paper.Point(x[i], y[i]));
    }
    addPath(path, { x, y, t });
  });
}


export function exportData(){
  const canvasData = store.getState().canvasData;
  const canvas = canvasData.allCanvas[canvasData.currentCanvas];
  const data = {paths:[], images:[], texts:[], meta:{}};

  canvas.bush.all().forEach(bushItem => {
    const {path, minX, minY, maxX, maxY } = bushItem;
    data.paths.push({x:path.data.x, y:path.data.y, t:path.data.t, box:[minX, minY, maxX, maxY]});
  });

  downloadToClient(JSON.stringify(data), "notes-export.json", "application/json");
}

/** Download data to client */
export function downloadToClient(content, fileName, contentType) {
  let a = document.createElement("a");
  let file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
