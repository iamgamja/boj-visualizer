import { Board, datatype, stepstype, styletype } from "../utils";

export type simulation = {
  data: datatype;
  style: styletype;
  steps: stepstype;
  stepNames: string[];
  parseBoard: (s: string) => Board;
};
