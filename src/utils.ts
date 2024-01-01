export enum State {
  Block,
  Item,
  Empty,
}

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export const dd: Record<Direction, [dy: number, dx: number]> = {
  [Direction.Up]: [-1, 0],
  [Direction.Down]: [1, 0],
  [Direction.Left]: [0, -1],
  [Direction.Right]: [0, 1],
};

export class Cell {
  state: State;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  text?: string;
  constructor(
    state: State,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { value, text }: { value?: any; text?: string } = {}
  ) {
    this.state = state;
    this.value = value;
    this.text = text;
  }

  copy() {
    return new Cell(this.state, {
      value: deepcopyobject(this.value),
      text: this.text,
    });
  }
}

/**
 * grid, player을 할당해야 합니다.
 */
export class Board {
  N: number;
  M: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  grid: Cell[][];
  player: { y: number; x: number };
  target: { y: number; x: number } | null;
  text: (board: Board) => string;

  constructor(
    N: number,
    M: number,
    {
      value,
      text = () => "",
    }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { value?: any; text?: (board: Board) => string } = {}
  ) {
    this.N = N;
    this.M = M;

    this.value = value;
    this.text = text;

    this.grid = Array(N)
      .fill([])
      .map(() => Array(M));
    this.player = { y: -1, x: -1 };
    this.target = null;
  }

  get playerCell() {
    return this.grid[this.player.y][this.player.x];
  }

  set playerCell(cell) {
    this.grid[this.player.y][this.player.x] = cell;
  }

  canmove(
    direction: Direction,
    {
      start = this.player,
      c,
    }: {
      start?: { y: number; x: number };
      c?: (now: Cell, next: Cell) => boolean;
    } = {}
  ) {
    const [dy, dx] = dd[direction];
    const [targety, targetx] = [start.y + dy, start.x + dx];

    if (!(0 <= targety && targety < this.N)) return false;
    if (!(0 <= targetx && targetx < this.M)) return false;

    const target = this.grid[targety][targetx];

    if (target.state === State.Block) return false;

    if (c) return c(this.playerCell, target);
    return true;
  }

  move(
    direction: Direction,
    { cb }: { cb?: (prev: Cell, now: Cell) => void } = {}
  ) {
    const prev = this.playerCell;

    this.player = {
      y: this.player.y + dd[direction][0],
      x: this.player.x + dd[direction][1],
    };

    if (cb) cb(prev, this.playerCell);
  }

  bfs(
    target: (cell: Cell) => boolean,
    {
      start = this.player,
      order = [Direction.Up, Direction.Left, Direction.Right, Direction.Down],
      c,
    }: {
      start?: { y: number; x: number };
      order?: Direction[];
      c?: (now: Cell, next: Cell) => boolean;
    } = {}
  ): { y: number; x: number; distance: number } | null {
    const q: { y: number; x: number; distance: number }[] = [];
    const visit: boolean[][] = Array(this.N)
      .fill([])
      .map(() => Array(this.M).fill(false));

    q.push({ ...start, distance: 0 });
    visit[start.y][start.x] = true;

    while (q.length) {
      const { y, x, distance } = q.shift()!;
      if (target(this.grid[y][x])) {
        return { y, x, distance };
      }

      for (const d of order) {
        if (!this.canmove(d, { start: { y, x }, c })) continue;
        if (visit[y + dd[d][0]][x + dd[d][1]]) continue;
        visit[y + dd[d][0]][x + dd[d][1]] = true;

        q.push({ y: y + dd[d][0], x: x + dd[d][1], distance: distance + 1 });
      }
    }

    return null;
  }

  getDistance(
    target: (cell: Cell) => boolean,
    {
      start = this.player,
      c,
    }: {
      start?: { y: number; x: number };
      c?: (now: Cell, next: Cell) => boolean;
    } = {}
  ) {
    const res = this.bfs(target, { start, c });

    if (!res) return null;
    return res.distance;
  }

  /**
   * target으로 최단거리로 가려면 지금 어떤 방향으로 가야 하는지 반환한다.
   * 각 방향별로 인접한 칸에서 target까지 bfs를 돌려 가장 거리가 짧은 방향을 반환한다.
   */
  findDirection(
    target: (cell: Cell) => boolean,
    {
      start = this.player,
      order = [Direction.Up, Direction.Left, Direction.Right, Direction.Down],
      c,
    }: {
      start?: { y: number; x: number };
      order?: Direction[];
      c?: (now: Cell, next: Cell) => boolean;
    } = {}
  ): Direction {
    const moveabledirections = order.filter((d) =>
      this.canmove(d, { start, c })
    );
    moveabledirections.sort((d1, d2) => {
      const { distance: d1_distance } = this.bfs(target, {
        start: { y: start.y + dd[d1][0], x: start.x + dd[d1][1] },
        order,
        c,
      })!;
      const { distance: d2_distance } = this.bfs(target, {
        start: { y: start.y + dd[d2][0], x: start.x + dd[d2][1] },
        order,
        c,
      })!;
      return d1_distance - d2_distance; // distance를 기준으로 오름차순 정렬
    });

    return moveabledirections[0];
  }

  copy() {
    const res = new Board(this.N, this.M, {
      value: deepcopyobject(this.value),
      text: this.text,
    });

    for (let y = 0; y < this.N; y++) {
      for (let x = 0; x < this.M; x++) {
        res.grid[y][x] = this.grid[y][x].copy();
      }
    }
    res.player = deepcopyobject(this.player);
    res.target = deepcopyobject(this.target);

    return res;
  }
}

export type stepstype = ((board: Board) => [Board, number])[];

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

export type datatype = { name: string; link: string; examples: string[] };
