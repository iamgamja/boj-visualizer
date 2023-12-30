export default function ShowProgressSideBar({
  history,
  stepNames,
  selected,
  onStop,
  onClickShow,
}: {
  history: number[];
  stepNames: string[];
  selected: number;
  onStop: () => void;
  onClickShow: (idx: number) => void;
}) {
  return (
    <aside className="w-1/4 h-full bg-red-200 overflow-y-scroll">
      <div className="flex flex-row">
        <button
          className="px-7 py-3 m-2 bg-blue-500 rounded-lg"
          onClick={onStop}
        >
          Back
        </button>
      </div>

      {history.map((step, idx) => (
        <div
          className={`block p-3 border-b-[1px] border-gray-100 hover:bg-red-300 ${
            idx === selected ? "bg-slate-200 hover:bg-slate-200" : ""
          }`}
          key={idx}
          onClick={() => onClickShow(idx)}
        >
          {step !== -1 ? stepNames[step] : "init"}
        </div>
      ))}
    </aside>
  );
}
