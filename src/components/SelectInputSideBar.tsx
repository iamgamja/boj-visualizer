import { useRef, useState } from "react";

export default function SelectInputSideBar({
  examples,
  onRun,
}: {
  examples: string[];
  onRun: (input: string) => void;
}) {
  const customInputRadio = useRef<HTMLInputElement>(null);
  const customInputTextarea = useRef<HTMLTextAreaElement>(null);

  const [input, setInput] = useState("");

  return (
    <aside className="w-1/4 h-full bg-red-200 overflow-y-scroll">
      <div className="flex flex-row">
        <a className="px-7 py-3 m-2 bg-blue-500 rounded-lg" href="./?s=">
          Back
        </a>
      </div>

      {examples.map((it, idx) => (
        <label className="block p-3 border-b-[1px] border-gray-100" key={idx}>
          <input
            type="radio"
            name="input"
            className="me-1"
            onClick={() => setInput(it)}
          />
          Example {idx + 1}: <pre className="bg-gray-400 text-sm">{it}</pre>
        </label>
      ))}

      <label className="block p-3 border-b-[1px] border-gray-100">
        <input
          ref={customInputRadio}
          type="radio"
          name="input"
          className="me-1"
          onChange={() => setInput(customInputTextarea.current!.value)}
        />
        Custom Input:
        <textarea
          ref={customInputTextarea}
          className="w-full font-mono text-sm h-40 border-none outline-none"
          onFocus={(e) => {
            customInputRadio.current!.checked = true;
            setInput(e.target.value);
          }}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
      </label>

      <div className="flex flex-row-reverse">
        <button
          className="px-7 py-3 m-2 bg-blue-500 rounded-lg"
          onClick={() => onRun(input)}
        >
          Run
        </button>
      </div>
    </aside>
  );
}
