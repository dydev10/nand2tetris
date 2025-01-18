import { create } from "zustand";
import { Box, Connection } from "../components/ConnectedCanvas";
import { LogicGates, TerminalNodes } from "../enums/gate";
import { resolveGateOutputs } from "../helpers/gates";

const sampleNOR = {
  boxes: [
    {
      x: 100,
      y: 150,
      width: 80,
      height: 60,
      inputs: [0,0],
      outputs: [0],
      name: "OR",
    },
    {
      x: 300,
      y: 150,
      width: 80,
      height: 60,
      inputs: [0],
      outputs: [1],
      name: "NOT",
    },
  ],
  connections: [{
    fromBox: 0,
    fromNode: 0,
    toBox : 1,
    toNode: 0,
  }]
};

type NodeStore = {
  pastNode: Box,
  nextNode: Box,
  terminalConnections: Connection[],
  boxes: Box[],
  connections: Connection[],
  setupNodes:(canvasWidth: number, canvasHeight: number) => void,
  toggleBoxInput: (boxIndex: number, inputIndex: number) => void,
  activateBoxInput: (boxIndex: number, inputIndex: number) => void,
  deActivateBoxInput: (boxIndex: number, inputIndex: number) => void,
  moveBox: (boxIndex: number, toX: number, toY: number) => void,
  deleteConnection: (connIndex: number) => void,
  addConnection: (connectionStart: { box: number, node: number }, boxIndex: number, inputIndex: number) => void,
  resolveUpdatedGates: () => void, // must be final state update on each user interaction
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
    inputs: [0], // inputs to be ignored
    outputs: [1],
    name: TerminalNodes.PAST,
  },
  nextNode: {
    x: 250, // canvas width, set it dynamically
    y: 0,
    width: 0,
    height: 300,
    inputs: [0],
    outputs: [1], // outputs to be ignored
    name: TerminalNodes.NEXT,
  },
  terminalConnections: [],
  

  boxes: [],
  connections: [],

  /**
   * reducers
  */

  // init
  setupNodes:(canvasWidth: number, canvasHeight: number) => {
    const pastNode = get().pastNode;
    const nextNode = get().nextNode;
    console.log('old pastNode', pastNode, { canvasWidth, canvasHeight });
    
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

    console.log('NEW pastNode', pastNode);


    // finally push terminal nodes and saved boxes + connections
    set({
      boxes: [...structuredClone(sampleNOR.boxes)],
      connections: [...structuredClone(sampleNOR.connections)],
    })
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
    set({
      boxes: get().boxes.map((prevBox) =>({
        ...prevBox,
        outputs: resolveGateOutputs(prevBox.name as LogicGates, prevBox.inputs),
      })),
    });
  },
}));

export default useNodeStore;