import React, { useRef, useEffect, useState } from "react";
import { Color } from "three";
import { IfcViewerAPI } from "web-ifc-viewer";
import ViewCubeContainer from "../ViewerCube/ViewCubeContainer";
import cl from "./Viewer.module.css";
function Viewer() {
  const viewerDiv = useRef();
  const [viewer, setViewer] = useState(null);
  const [model, setModel] = useState(null);
  const [loading, setIsLoading] = useState(true);
  useEffect(() => {
    const container = viewerDiv.current;

    const viewer = new IfcViewerAPI({
      container,
      backgroundColor: new Color(0xc0c0c0),
    });

    viewer.axes.setAxes();
    viewer.grid.setGrid();
    container.onclick = () => viewer.IFC.selector.pickIfcItem(true);
    container.onmousemove = () => viewer.IFC.selector.prePickIfcItem();
    viewer.clipper.active = true;

    container.onkeydown = (event) => {
      if (event.code === "KeyP") {
        viewer.clipper.createPlane();
      } else if (event.code === "KeyO") {
        viewer.clipper.deletePlane();
      }
    };
    container.ondblclick = () => {
      viewer.context.fitToFrame();
    };
    container.oncontextmenu = () => {
      viewer.IFC.selector.unpickIfcItems();
    };
    async function loadIfc(url) {
      const model = await viewer.IFC.loadIfcUrl(url, true);
      setModel(model);
      setViewer(viewer);
      setIsLoading(false);
    }

    viewer.IFC.setWasmPath("../../../");
    loadIfc("models/test.ifc");
  }, []);
  return (
    <div id={cl.viewer_container} ref={viewerDiv}>
      <ViewCubeContainer viewer={viewer} model={model}></ViewCubeContainer>
    </div>
  );
}

export default Viewer;
