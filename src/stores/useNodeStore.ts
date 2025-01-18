import { create } from "zustand";
import { Box, Connection } from "../components/ConnectedCanvas";

type NodeStore = {
  boxes: Box[],
  connections: Connection[],
  setBoxes: (set: Box[]) => void,
  deleteConnection: (connIndex: number) => void,
  addConnection: (connectionStart: { box: number, node: number }, boxIndex: number, inputIndex: number) => void,
}

const useNodeStore = create<NodeStore>((set, get) =>({
  count: { c: 0 },
  boxes: [],
  connections: [],
  setBoxes: (boxes) => {
    // const prevBoxes = get().boxes;
    set({
      boxes,
    });
  },
  deleteConnection: (connIndex) => {
    const prevConnections = get().connections;
    console.log('DELETING prev conn', prevConnections);
    set({
      connections: prevConnections.filter((_prev, i) => i !== connIndex)
    })
    console.log('DELETING conn', get().connections);
  },
  addConnection: (connectionStart, boxIndex: number, inputIndex: number) => {
    const prevConnections = get().connections;
    console.log('ADDING prev conn', prevConnections);
    set({
      connections: [
        ...prevConnections,
        {
          fromBox: connectionStart.box,
          fromNode: connectionStart.node,
          toBox: boxIndex,
          toNode: inputIndex,
        },
      ],
    })
    console.log('ADDING conn', get().connections);
  },
  
}));

export default useNodeStore;
