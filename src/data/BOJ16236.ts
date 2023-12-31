import { Cell, getPlayer, state, board, stepstype, datatype } from "../utils";

export const data: datatype = {
  name: "BOJ 16236 - 아기 상어",
  link: "https://boj.kr/16236",
  examples: [
    "3\n0 0 0\n0 0 0\n0 9 0",
    "3\n0 0 1\n0 0 0\n0 9 0",
    "4\n4 3 2 1\n0 0 0 0\n0 0 9 0\n1 2 3 4",
  ],
};

export const steps: stepstype = [
  function (board: board): [board, number] {
    const [player_y, player_x] = getPlayer(board);
    const player = board[player_y][player_x];

    const q: [y: number, x: number][] = [];
    const visit: boolean[][] = Array(board.length)
      .fill([])
      .map(() => Array(board.length).fill(false));

    q.push([player_y, player_x]);
    visit[player_y][player_x] = true;

    let flag = false;

    while (q.length) {
      const [y, x] = q.shift()!;
      if (
        board[y][x].state === state.Item &&
        board[y][x].value.size < player.value.size
      ) {
        player.value.exp++;
        if (player.value.size === player.value.exp) {
          player.value.size++;
          player.value.exp = 0;
        }

        board[y][x] = new Cell(
          y,
          x,
          state.Player,
          player.value,
          board,
          player.N,
          player.N
        );

        board[player_y][player_x] = new Cell(
          player_y,
          player_x,
          state.Empty,
          { size: 0 },
          board,
          player.N,
          player.N
        );

        flag = true;

        break;
      }

      for (const [yy, xx] of [
        // 위부터, 왼쪽부터 bfs
        [y - 1, x],
        [y, x - 1],
        [y, x + 1],
        [y + 1, x],
      ]) {
        if (
          !board[y][x].canmove(
            yy,
            xx,
            (_, next) => player.value.size >= next.value.size
          )
        )
          continue;
        if (visit[yy][xx]) continue;
        visit[yy][xx] = true;

        q.push([yy, xx]);
      }
    }

    if (!flag) {
      return [board, -1];
    }

    return [board, 0];
  },
];

export const stepNames = ["이동"];

export function parseBoard(s: string): board {
  const [first, ...remain] = s.split("\n");
  const [N] = first.split(" ").map(Number);

  const board: board = new Array(N).fill([]).map(() => new Array(N));

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (+remain[y].split(" ")[x] === 9)
        board[y][x] = new Cell(
          y,
          x,
          state.Player,
          { size: 2, exp: 0 },
          board,
          N,
          N
        );
      else if (+remain[y].split(" ")[x] === 0)
        board[y][x] = new Cell(y, x, state.Empty, { size: 0 }, board, N, N);
      else
        board[y][x] = new Cell(
          y,
          x,
          state.Item,
          { size: +remain[y].split(" ")[x] },
          board,
          N,
          N
        );
    }
  }

  return board;
}
