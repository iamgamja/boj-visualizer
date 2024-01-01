import { Cell, State, Board, stepstype, datatype, Direction } from "../utils";

export const data: datatype = {
  name: "BOJ 16236 - 아기 상어",
  link: "https://boj.kr/16236",
  examples: [
    `3
0 0 0
0 0 0
0 9 0`,
    `3
0 0 1
0 0 0
0 9 0`,
    `4
4 3 2 1
0 0 0 0
0 0 9 0
1 2 3 4`,
    `6
5 4 3 2 3 4
4 3 2 3 4 5
3 2 9 5 6 6
2 1 2 3 4 5
3 2 1 6 5 4
6 6 6 6 6 6`,
    `6
6 0 6 0 6 1
0 0 0 0 0 2
2 3 4 5 6 6
0 0 0 0 0 2
0 2 0 0 0 0
3 9 3 0 0 1`,
    `6
1 1 1 1 1 1
2 2 6 2 2 3
2 2 5 2 2 3
2 2 2 4 6 3
0 0 0 0 0 6
0 0 0 0 0 9`,
  ],
};

export const steps: stepstype = [
  function 탐색(board) {
    const res = board.bfs(
      (cell) => cell.state === State.Item && cell.value.size < board.value.size,
      {
        order: [Direction.Up, Direction.Left, Direction.Right, Direction.Down],
        c: (_, next) =>
          next.state === State.Empty || next.value.size <= board.value.size,
      }
    );

    if (!res) return [board, -1];

    board.target = res;
    return [board, 1];
  },
  function 이동(board) {
    const d = board.findDirection(
      (cell) => cell.state === State.Item && cell.value.size < board.value.size,
      {
        order: [Direction.Up, Direction.Left, Direction.Right, Direction.Down],
        c: (_, next) =>
          next.state === State.Empty || next.value.size <= board.value.size,
      }
    );

    board.move(d);

    // target에 도달했다면
    if (
      board.getDistance(
        (cell) =>
          cell.state === State.Item && cell.value.size < board.value.size,
        {
          c: (_, next) =>
            next.state === State.Empty || next.value.size <= board.value.size,
        }
      ) === 0
    ) {
      return [board, 2];
    }

    return [board, 1];
  },
  function 성장(board) {
    board.playerCell = new Cell(State.Empty);

    board.value.exp++;
    if (board.value.size === board.value.exp) {
      board.value.size++;
      board.value.exp = 0;
    }

    return [board, 0];
  },
];

export const stepNames = ["탐색", "이동", "성장"];

export function parseBoard(s: string): Board {
  const [first, ...remain] = s.split("\n").map((s) => s.split(" ").map(Number));
  const [N] = first;

  const board = new Board(N, N, { value: { size: 2, exp: 0 } });

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (remain[y][x] === 9) {
        board.grid[y][x] = new Cell(State.Empty);
        board.player = { y, x };
      } else if (remain[y][x] === 0) {
        board.grid[y][x] = new Cell(State.Empty);
      } else {
        board.grid[y][x] = new Cell(State.Item, {
          value: { size: remain[y][x] },
          text: remain[y][x].toString(),
        });
      }
    }
  }

  return board;
}
