import { Cell, getPlayer, State, board, stepstype, datatype } from "../utils";

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
        board[y][x].state === State.Item &&
        board[y][x].value.size < player.value.size
      ) {
        player.value.exp++;
        if (player.value.size === player.value.exp) {
          player.value.size++;
          player.value.exp = 0;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        player.move(y, x, (prev, _) => {
          prev.state = State.Empty;
          prev.value = { size: 0 };
          prev.text = null;
        });

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
          State.Player,
          { size: 2, exp: 0 },
          null,
          board,
          N,
          N
        );
      else if (+remain[y].split(" ")[x] === 0)
        board[y][x] = new Cell(
          y,
          x,
          State.Empty,
          { size: 0 },
          null,
          board,
          N,
          N
        );
      else
        board[y][x] = new Cell(
          y,
          x,
          State.Item,
          { size: +remain[y].split(" ")[x] },
          remain[y].split(" ")[x],
          board,
          N,
          N
        );
    }
  }

  return board;
}
