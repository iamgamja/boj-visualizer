import { useEffect, useState } from "react";
import SelectInputSideBar from "./SelectInputSideBar";
import ShowProgressSideBar from "./ShowProgressSideBar";
import { Board } from "../utils";
import target from "../assets/target.svg";
import { simulation } from "../constants/const";

export default function Simulation({ simulation }: { simulation: simulation }) {
  const [isrunning, setIsrunning] = useState(false);
  const [boardHistory, setBoardHistory] = useState<Board[]>([]);
  const [stepHistory, setStepHistory] = useState<number[]>([]);
  const [showingBoard, setShowingBoard] = useState<number>(0);
  const [log, setLog] = useState("");

  function onRun(s: string) {
    setIsrunning(true);
    setShowingBoard(0);

    // 먼저 시뮬레이션을 한다
    // 1000번 이상 반복할 경우 무한 루프로 판단하고 중지한다.
    let board = simulation.parseBoard(s);
    const boardHistory: Board[] = [board.copy()];
    const stepHistory: number[] = [-1];
    let step = 0;
    while (boardHistory.length <= 1000) {
      const laststep = step;
      [board, step] = simulation.steps[step](board);
      boardHistory.push(board.copy());
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

  useEffect(() => {
    if (isrunning) {
      setLog(boardHistory[showingBoard].text(boardHistory[showingBoard]));
    }
  }, [isrunning, boardHistory, showingBoard]);

  return (
    <>
      <div className="h-full flex flex-row">
        <main className="relative flex-auto bg-green-200">
          {isrunning &&
            boardHistory[showingBoard].grid.map((line, y) => (
              <div key={y}>
                {line.map((cell, x) => (
                  <div
                    className={`inline-flex items-center justify-center size-10 border-[1px] border-black relative ${
                      y === boardHistory[showingBoard].player.y &&
                      x === boardHistory[showingBoard].player.x
                        ? simulation.style["Player"].backgroundColor
                        : simulation.style[cell.type].backgroundColor
                    } ${
                      y === boardHistory[showingBoard].player.y &&
                      x === boardHistory[showingBoard].player.x
                        ? simulation.style["Player"].textColor
                        : simulation.style[cell.type].textColor
                    }`}
                    key={`${y} ${x}`}
                  >
                    {y === boardHistory[showingBoard].player.y &&
                    x === boardHistory[showingBoard].player.x
                      ? "P"
                      : simulation.style[cell.type].text({
                          cell,
                          board: boardHistory[showingBoard],
                          y,
                          x,
                        })}

                    {/* 타겟 */}
                    {y === boardHistory[showingBoard].target?.y &&
                      x === boardHistory[showingBoard].target?.x && (
                        <div className="absolute">
                          <img src={target} />
                        </div>
                      )}
                  </div>
                ))}
              </div>
            ))}

          {isrunning && (
            <div className="absolute right-0 top-0">
              <pre>{log}</pre>
            </div>
          )}
        </main>

        {isrunning ? (
          <ShowProgressSideBar
            history={stepHistory}
            stepNames={simulation.stepNames}
            selected={showingBoard}
            onStop={onStop}
            onClickShow={(idx) => setShowingBoard(idx)}
          />
        ) : (
          <SelectInputSideBar
            examples={simulation.data.examples}
            onRun={onRun}
          />
        )}
      </div>
    </>
  );
}
