export enum state {
  Player,
  Block,
  Empty,
}

export class Cell {
  y: number;
  x: number;
  state: state;
  board: board;
  N: number;
  M: number;
  constructor(
    y: number,
    x: number,
    state: state,
    board: board,
    N: number,
    M: number
  ) {
    this.y = y;
    this.x = x;
    this.state = state;
    this.board = board;
    this.N = N;
    this.M = M;
  }

  canmove(y: number, x: number): boolean {
    if (
      !(
        (this.y === y && this.x + 1 === x) ||
        (this.y + 1 === y && this.x === x)
      )
    )
      return false;
    if (!(0 <= y && y < this.N)) return false;
    if (!(0 <= x && x < this.M)) return false;
    if (this.board[y][x].state === state.Block) return false;
    return true;
  }

  move(y: number, x: number) {
    if (this.state !== state.Player) throw new Error("Not player");
    if (!this.canmove(y, x)) throw new Error("Can't move");

    this.state = state.Empty;
    this.board[y][x].state = state.Player;
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
      res[y][x] = new Cell(t.y, t.x, t.state, t.board, t.N, t.M);
    }
  }

  return res;
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
