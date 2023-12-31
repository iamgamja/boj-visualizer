import { useEffect, useState } from "react";
import SelectInputSideBar from "./SelectInputSideBar";
import ShowProgressSideBar from "./ShowProgressSideBar";
import {
  board,
  datatype,
  deepcopyboard,
  stepstype,
  style,
  text,
} from "../utils";

export default function Simulation({
  data,
  steps,
  stepNames,
  parseBoard,
}: {
  data: datatype;
  steps: stepstype;
  stepNames: string[];
  parseBoard: (s: string) => board;
}) {
  const [isrunning, setIsrunning] = useState(false);
  const [boardHistory, setBoardHistory] = useState<board[]>([]);
  const [stepHistory, setStepHistory] = useState<number[]>([]);
  const [showingBoard, setShowingBoard] = useState<number>(0);

  function onRun(s: string) {
    setIsrunning(true);
    setShowingBoard(0);

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

  function onKeyDown(e: KeyboardEvent) {
    if (!isrunning) return;
    if (e.key === "ArrowLeft") {
      if (showingBoard !== 0) setShowingBoard((x) => x - 1);
    } else if (e.key === "ArrowRight") {
      if (showingBoard !== boardHistory.length - 1)
        setShowingBoard((x) => x + 1);
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <>
      <div className="h-full flex flex-row">
        <main className="flex-auto bg-green-200">
          {isrunning &&
            boardHistory[showingBoard].map((line, idx1) => (
              <div>
                {line.map((cell, idx2) => (
                  <div
                    className={`inline-flex items-center justify-center size-10 border-[1px] border-black ${
                      style[cell.state]
                    }`}
                    key={`${idx1} ${idx2}`}
                  >
                    {text[cell.state]}
                  </div>
                ))}
              </div>
            ))}
        </main>
        {isrunning ? (
          <ShowProgressSideBar
            history={stepHistory}
            stepNames={stepNames}
            selected={showingBoard}
            onStop={onStop}
            onClickShow={(idx) => setShowingBoard(idx)}
          />
        ) : (
          <SelectInputSideBar examples={data.examples} onRun={onRun} />
        )}
      </div>
    </>
  );
}
