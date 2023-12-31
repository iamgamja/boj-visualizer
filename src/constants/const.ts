import { board, datatype, state, stepstype } from "../utils";

export const style: Record<state, string> = {
  [state.Player]: "bg-red-300",
  [state.Block]: "bg-gray-800 text-white",
  [state.Item]: "bg-gray-500",
  [state.Empty]: "",
};

export const text: Record<state, string> = {
  [state.Player]: "P",
  [state.Block]: "X",
  [state.Item]: "O",
  [state.Empty]: ".",
};

export type simulation = {
  data: datatype;
  steps: stepstype;
  stepNames: string[];
  parseBoard: (s: string) => board;
};
