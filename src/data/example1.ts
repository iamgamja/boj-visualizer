import { Cell, getPlayer, state, board, stepstype } from "../utils";

/*
다음과 같은 문제를 구현한다:

N*M 크기의 격자가 주어진다. 각 칸은 비어있거나(.) 막혀있다(X).
처음에는 왼쪽 위 칸에 플레이어가 있다.
다음 과정을 반복한다:
  오른쪽으로 갈 수 있다면 이동한다.
  그렇지 않고 아래로 갈 수 있다면 이동한다.
  그렇지 않다면 종료한다.

# 입력
첫째 줄에 N, M이 주어진다. (1 <= N,M <= 100)
다음 N줄에 M개의 글자가 주어진다. 각 글자는 `.`이거나 `X`이다.
왼쪽 위 칸은 항상 `.`이다.
*/

export const data = {
  name: "Example 1",
  link: "https://example.com",
  examples: [
    "3 3\n..X\n...\n...",
    "2 2\n.X\nX.",
    "10 1\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.",
  ],
};

export const steps: stepstype = [
  function (board: board): [board, number] {
    const [y, x] = getPlayer(board);

    if (board[y][x].canmove(y, x + 1)) {
      board[y][x].move(y, x + 1);
      return [board, 0];
    }

    if (board[y][x].canmove(y + 1, x)) {
      board[y][x].move(y + 1, x);
      return [board, 0];
    }

    return [board, -1];
  },
];

export const stepNames = ["이동"];

export function parseBoard(s: string): board {
  const [first, ...remain] = s.split("\n");
  const [N, M] = first.split(" ").map(Number);

  const board: board = new Array(N).fill([]).map(() => new Array(M));

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < M; x++) {
      if (y == 0 && x == 0)
        board[y][x] = new Cell(y, x, state.Player, board, N, M);
      else if (remain[y][x] == ".")
        board[y][x] = new Cell(y, x, state.Empty, board, N, M);
      else board[y][x] = new Cell(y, x, state.Block, board, N, M);
    }
  }

  return board;
}
