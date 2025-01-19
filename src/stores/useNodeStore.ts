import { create } from "zustand";
import { Box, Connection } from "../components/ConnectedCanvas";
import { TerminalNodes } from "../enums/gate";
import { generateGate, generateTruth, resolveTerminals } from "../helpers/gates";
import { GateTable } from "../helpers/constants";

const sampleNOR = {
  boxes: [
    // {
    //   x: 100,
    //   y: 150,
    //   width: 80,
    //   height: 60,
    //   inputs: [0,0],
    //   outputs: [0],
    //   name: "OR",
    //   label: "OR",
    // },
    {
      x: 100,
      y: 150,
      width: 80,
      height: 60,
      inputs: [0,0],
      outputs: [0],
      name: "AND",
      label: "AND",
    },
    {
      x: 300,
      y: 150,
      width: 80,
      height: 60,
      inputs: [0],
      outputs: [1],
      name: "NOT",
      label: "NOT",
    },
  ],
  connections: [{
    fromBox: 2,
    fromNode: 0,
    toBox : 3,
    toNode: 0,
  }]
};

export type SavedGate = {
  name: string,
  boxes: Box[],
  connections: Connection[],
  table: GateTable;
}

type NodeStore = {
  savedGates: SavedGate[],
  pastNode: Box,
  nextNode: Box,
  terminalConnections: Connection[],
  boxes: Box[],
  connections: Connection[],
  setupNodes:(canvasWidth: number, canvasHeight: number, name?: string) => void,
  toggleBoxInput: (boxIndex: number, inputIndex: number) => void,
  activateBoxInput: (boxIndex: number, inputIndex: number) => void,
  deActivateBoxInput: (boxIndex: number, inputIndex: number) => void,
  moveBox: (boxIndex: number, toX: number, toY: number) => void,
  addBox: (name: string, table: GateTable) => void,
  deleteConnection: (connIndex: number) => void,
  addConnection: (connectionStart: { box: number, node: number }, boxIndex: number, inputIndex: number) => void,
  resolveUpdatedGates: () => void, // must be final state update on each user interaction
  saveGates: () => void, // must be final state update on each user interaction
}

const useNodeStore = create<NodeStore>((set, get) =>({
  /**
   * states
   */
  pastNode: {
    x: 0,
    y: 0,
    width: 0,
    height: 300,
    inputs: [0, 1], // inputs NOT to be ignored
    outputs: [0, 1],
    name: TerminalNodes.PAST,
  },
  nextNode: {
    x: 250, // canvas width, set it dynamically
    y: 0,
    width: 0,
    height: 300,
    inputs: [0],
    outputs: [0], // outputs NOT to be ignored
    name: TerminalNodes.NEXT,
  },
  terminalConnections: [],
  

  boxes: [],
  connections: [],

  savedGates: [],

  /**
   * reducers
  */

  // init
  setupNodes:(canvasWidth: number, canvasHeight: number, name?: string) => {
    
    const pastNode = get().pastNode;
    const nextNode = get().nextNode;
    
    // first set terminal node heights
    set({
      pastNode: {
        ...pastNode,
        height: canvasHeight,
      },
      nextNode: {
        ...nextNode,
        height: canvasHeight,
        x: canvasWidth,
      },
    });

    let saved;
    if (name) {
      saved = get().savedGates.find((gate) => gate.name === name);
    }

    if(!saved) {
      // finally push terminal nodes and saved boxes + connections
      set({
        boxes: [get().pastNode, get().nextNode, ...structuredClone(sampleNOR.boxes)],
        connections: [...get().terminalConnections, ...structuredClone(sampleNOR.connections)],
      });
    } else {
      // finally push terminal nodes and saved boxes + connections
      set({
        boxes: [...structuredClone(saved.boxes)],
        connections: [...structuredClone(saved.connections)],
      });
    }

  },

  toggleBoxInput: (boxIndex, inputIndex) => {
    const prevBoxes = get().boxes;
    const boxes = prevBoxes.map((prev, i) =>
      i === boxIndex
        ? {
          ...prev,
          inputs: prev.inputs.map((state, j) =>
            j === inputIndex ? (state === 1 ? 0 : 1) : state
          ),
        }
        : prev
    );
    set({
      boxes,
    });
  },
  activateBoxInput: (boxIndex, inputIndex) => {
    const prevBoxes = get().boxes;
    const boxes = prevBoxes.map((prev, i) =>
      i === boxIndex
        ? {
            ...prev,
            inputs: prev.inputs.map((state, j) =>
              j === inputIndex ? 1 : state
            ),
          }
        : prev
    )
    set({
      boxes,
    });
  },
  deActivateBoxInput: (boxIndex, inputIndex) => {
    const prevBoxes = get().boxes;
    const boxes = prevBoxes.map((prev, i) =>
      i === boxIndex
        ? {
            ...prev,
            inputs: prev.inputs.map((state, j) =>
              j === inputIndex ? 0 : state
            ),
          }
        : prev
    )
    set({
      boxes,
    });
  },
  moveBox: (boxIndex, toX, toY) => {
    const prevBoxes = get().boxes;
    const boxes =  prevBoxes.map((prev, i) =>
      i === boxIndex
        ? { ...prev, x: toX, y: toY }
        : prev
    )
    set({
      boxes,
    });
  },
  addBox: (name, table) => {
    set({
      boxes: [...get().boxes, generateGate(name, table)]
    });
  },
  deleteConnection: (connIndex) => {
    const prevConnections = get().connections;
    set({
      connections: prevConnections.filter((_prev, i) => i !== connIndex)
    })
  },
  addConnection: (connectionStart, boxIndex: number, inputIndex: number) => {
    const prevConnections = get().connections;
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
  },

  // called after all state updates [TODO: convert to listener if infinite render is fixed (no setState inside)]
  resolveUpdatedGates: () => {
    const boxes = get().boxes;
    const connections = get().connections;
    const newBoxes = resolveTerminals(boxes, connections);    

    set({
      boxes: newBoxes,
    });
  },

  saveGates: () => {
    const boxes = get().boxes;
    const connections = get().connections;

    generateTruth(boxes, connections);
    
    const table = generateTruth(boxes, connections);
    
    const saving = {
      name: 'test-0',
      table,
      boxes: get().boxes,
      connections: get().connections,
    };

    set({
      savedGates: [...get().savedGates, saving],
    });
  },
}));

export default useNodeStore;
