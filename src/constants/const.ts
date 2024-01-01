import { Board, datatype, State, stepstype } from "../utils";

export const style: Record<State, string> = {
  [State.Block]: "bg-gray-800 text-white",
  [State.Item]: "bg-gray-500 text-white",
  [State.Empty]: "",
};

export const text: Record<State, string> = {
  [State.Block]: "X",
  [State.Item]: "O",
  [State.Empty]: ".",
};

export type simulation = {
  data: datatype;
  steps: stepstype;
  stepNames: string[];
  parseBoard: (s: string) => Board;
};
