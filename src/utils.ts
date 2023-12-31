export enum state {
  Player,
  Block,
  Empty,
}

export class Cell {
  y: number;
  x: number;
  state: state;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  board: board;
  N: number;
  M: number;
  constructor(
    y: number,
    x: number,
    state: state,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    board: board,
    N: number,
    M: number
  ) {
    this.y = y;
    this.x = x;
    this.state = state;
    this.value = value;
    this.board = board;
    this.N = N;
    this.M = M;
  }

  canmove(
    y: number,
    x: number,
    c?: (now: Cell, next: Cell) => boolean
  ): boolean {
    if (
      !(
        (this.y === y && this.x + 1 === x) ||
        (this.y === y && this.x - 1 === x) ||
        (this.y + 1 === y && this.x === x) ||
        (this.y - 1 === y && this.x === x)
      )
    )
      return false;
    if (!(0 <= y && y < this.N)) return false;
    if (!(0 <= x && x < this.M)) return false;
    if (this.board[y][x].state === state.Block) return false;

    if (c) return c(this, this.board[y][x]);
    return true;
  }

  move(y: number, x: number, cb?: (now: Cell, next: Cell) => void) {
    if (this.state !== state.Player) throw new Error("Not player");
    if (!this.canmove(y, x)) throw new Error("Can't move");

    this.state = state.Empty;
    this.board[y][x].state = state.Player;

    if (cb) cb(this, this.board[y][x]);
  }
}

export type board = Cell[][];

export type stepstype = ((board: board) => [board, number])[];

export function deepcopyboard(board: board): board {
  const res: board = new Array(board.length)
    .fill([])
    .map(() => new Array(board[0].length));

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[0].length; x++) {
      const t = board[y][x];
      res[y][x] = new Cell(
        t.y,
        t.x,
        t.state,
        deepcopyobject(t.value),
        t.board,
        t.N,
        t.M
      );
    }
  }

  return res;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepcopyobject(obj: any): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clone: any = {};
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null)
      clone[key] = deepcopyobject(obj[key]);
    else clone[key] = obj[key];
  }

  return clone;
}

export function getPlayer(board: board): [y: number, x: number] {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[0].length; x++) {
      if (board[y][x].state === state.Player) {
        return [y, x];
      }
    }
  }

  throw new Error("unreachable");
}

export type datatype = { name: string; link: string; examples: string[] };
