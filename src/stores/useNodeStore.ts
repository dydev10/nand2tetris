import { create } from "zustand";
import { Box, Connection } from "../components/ConnectedCanvas";
import { LogicGates } from "../enums/gate";
import { resolveGateOutputs } from "../helpers/gates";

type NodeStore = {
  boxes: Box[],
  connections: Connection[],
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

  boxes: [
    {
      x: 350,
      y: 200,
      width: 80,
      height: 60,
      inputs: [0],
      outputs: [1],
      name: "NOT",
    },
    {
      x: 100,
      y: 100,
      width: 80,
      height: 60,
      inputs: [0, 1],
      outputs: [1],
      name: "NAND",
    },
    {
      x: 250,
      y: 150,
      width: 80,
      height: 60,
      inputs: [0,0],
      outputs: [0],
      name: "OR",
    },
  ],
  connections: [],

  /**
   * reducers
  */

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
