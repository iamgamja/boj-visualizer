export enum State {
  Player,
  Block,
  Item,
  Empty,
}

export class Cell {
  y: number;
  x: number;
  state: State;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  text: string | null;
  board: board;
  N: number;
  M: number;
  constructor(
    y: number,
    x: number,
    state: State,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    text: string | null,
    board: board,
    N: number,
    M: number
  ) {
    this.y = y;
    this.x = x;
    this.state = state;
    this.value = value;
    this.text = text;
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
    if (this.board[y][x].state === State.Block) return false;

    if (c) return c(this, this.board[y][x]);
    return true;
  }

  move(y: number, x: number, cb?: (prev: Cell, now: Cell) => void) {
    if (this.state !== State.Player) throw new Error("Not player");

    this.board[this.y][this.x] = new Cell(
      this.y,
      this.x,
      this.board[y][x].state,
      this.board[y][x].value,
      this.board[y][x].text,
      this.board,
      this.N,
      this.M
    );

    this.board[y][x] = new Cell(
      y,
      x,
      this.state,
      this.value,
      this.text,
      this.board,
      this.N,
      this.M
    );

    if (cb) cb(this.board[this.y][this.x], this.board[y][x]);
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
        t.text,
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
      if (board[y][x].state === State.Player) {
        return [y, x];
      }
    }
  }

  throw new Error("unreachable");
}

export type datatype = { name: string; link: string; examples: string[] };
