import { useState } from "react";
import SelectInputSideBar from "./components/SelectInputSideBar";
import ShowProgressSideBar from "./components/ShowProgressSideBar";

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

export default function App() {
  const [isrunning, setIsrunning] = useState(false);
  const [boardHistory, setBoardHistory] = useState<board[]>([]);
  const [stepHistory, setStepHistory] = useState<number[]>([]);
  const [showingBoard, setShowingBoard] = useState<number>(0);

  function onRun(s: string) {
    setIsrunning(true);

    // 먼저 시뮬레이션을 한다
    // 1000번 이상 반복할 경우 무한 루프로 판단하고 중지한다.
    let board = parseBoard(s);
    const boardHistory: board[] = [deepcopyboard(board)];
    const stepHistory: number[] = [-1];
    let step = 0;
    while (boardHistory.length <= 1000) {
      const laststep = step;
      [board, step] = steps[step](board);
      boardHistory.push(deepcopyboard(board));
      stepHistory.push(laststep);

      if (step === -1) break;
    }

    setBoardHistory(boardHistory);
    setStepHistory(stepHistory);
  }

  function onStop() {
    setIsrunning(false);
  }

  return (
    <>
      <div className="h-full flex flex-row bg-black">
        <main className="flex-auto bg-green-200">
          {isrunning &&
            boardHistory[showingBoard].map((line) => (
              <div>
                {line.map((cell) => {
                  if (cell.state === state.Player)
                    return (
                      <div className="inline-flex items-center justify-center size-10 border-[1px] border-black bg-red-300">
                        P
                      </div>
                    );
                  else if (cell.state === state.Empty)
                    return (
                      <div className="inline-flex items-center justify-center size-10 border-[1px] border-black ">
                        .
                      </div>
                    );
                  else
                    return (
                      <div className="inline-flex items-center justify-center size-10 border-[1px] border-black bg-gray-800 text-white">
                        X
                      </div>
                    );
                })}
              </div>
            ))}
        </main>
        {isrunning ? (
          <ShowProgressSideBar
            history={stepHistory}
            stepNames={stepNames}
            onStop={onStop}
            onClickShow={(idx) => setShowingBoard(idx)}
          />
        ) : (
          <SelectInputSideBar onRun={onRun} />
        )}
      </div>
    </>
  );
}

enum state {
  Player,
  Block,
  Empty,
}

class Cell {
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

function parseBoard(s: string): board {
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

function getPlayer(board: board): [y: number, x: number] {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[0].length; x++) {
      if (board[y][x].state === state.Player) {
        return [y, x];
      }
    }
  }

  throw new Error("unreachable");
}

type steps = ((board: board) => [board, number])[];
const steps: steps = [
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

const stepNames = ["이동"];

function deepcopyboard(board: board): board {
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
