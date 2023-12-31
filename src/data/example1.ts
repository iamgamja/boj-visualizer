import {
  Cell,
  Board,
  stepstype,
  datatype,
  Direction,
  styletype,
} from "../utils";

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

export const data: datatype = {
  name: "Example 1",
  link: "https://example.com",
  examples: [
    "3 3\n..X\n...\n...",
    "2 2\n.X\nX.",
    "10 1\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.",
  ],
};

export const style: styletype = {
  Player: {
    backgroundColor: "bg-red-300",
    textColor: "text-black",
    text: () => "P",
  },
  Wall: {
    backgroundColor: "bg-gray-800",
    textColor: "text-white",
    text: () => "X",
  },
  Empty: {
    backgroundColor: "bg-green-200",
    textColor: "text-black",
    text: () => ".",
  },
};

export const steps: stepstype = [
  function (board) {
    if (
      board.canmove(Direction.Right, {
        c: (_, next) => next.type === "Empty",
      })
    ) {
      board.move(Direction.Right);
      return [board, 0];
    }

    if (
      board.canmove(Direction.Down, { c: (_, next) => next.type === "Empty" })
    ) {
      board.move(Direction.Down);
      return [board, 0];
    }

    return [board, -1];
  },
];

export const stepNames = ["이동"];

export function parseBoard(s: string): Board {
  const [first, ...remain] = s.split("\n");
  const [N, M] = first.split(" ").map(Number);

  const board = new Board(N, M);

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < M; x++) {
      if (y == 0 && x == 0) {
        board.grid[y][x] = new Cell("Empty");
        board.player = { y, x };
      } else if (remain[y][x] == ".") {
        board.grid[y][x] = new Cell("Empty");
      } else {
        // X
        board.grid[y][x] = new Cell("Wall");
      }
    }
  }

  return board;
}
