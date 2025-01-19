import { Box, Connection } from "../components/ConnectedCanvas";
import { GateTable, TruthTable } from "./constants";

export type SavedGate = {
  name: string,
  boxes: Box[],
  connections: Connection[],
  table: GateTable;
}

export const getExtendedTable = (savedGates: SavedGate[]) : TruthTable => {
  return savedGates.reduce((acc, saved) => {
    acc = {
      ...acc,
      [saved.name]: saved.table,
    };
    return acc;
  }, {});
}