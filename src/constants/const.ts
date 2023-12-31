import { board, datatype, state, stepstype } from "../utils";

export const style: Record<state, string> = {
  [state.Player]: "bg-red-300",
  [state.Block]: "bg-gray-800 text-white",
  [state.Empty]: "",
};

export const text: Record<state, string> = {
  [state.Player]: "P",
  [state.Block]: "X",
  [state.Empty]: ".",
};

export type simulation = {
  data: datatype;
  steps: stepstype;
  stepNames: string[];
  parseBoard: (s: string) => board;
};
