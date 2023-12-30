import { useRef } from "react";

/** @todo 다른 레포로 분리하기 */
const examples = [
  `3 3
..X
...
...`,
  `2 2
.X
X.`,
  `10 1
.
.
.
.
.
.
.
.
l
l
l
.
`,
];

export default function SelectInputSideBar() {
  const customInputRadio = useRef<HTMLInputElement>(null);

  return (
    <aside className="w-1/4 h-full bg-red-200 overflow-y-scroll">
      {examples.map((it, idx) => (
        <label className="block p-3 border-b-[1px] border-gray-100">
          <input type="radio" name="input" className="me-1" />
          Example {idx + 1}: <pre className="bg-gray-400 text-sm">{it}</pre>
        </label>
      ))}

      <label className="block p-3 border-b-[1px] border-gray-100">
        <input
          type="radio"
          name="input"
          ref={customInputRadio}
          className="me-1"
          id="custominputradio"
        />
        Custom Input:
        <textarea
          className="w-full font-mono text-sm h-40 border-none outline-none"
          onFocus={() => {
            customInputRadio.current!.checked = true;
          }}
        ></textarea>
      </label>

      <div className="flex flex-row-reverse">
        <button className="px-7 py-3 m-2 bg-blue-500 rounded-lg">Run</button>
      </div>
    </aside>
  );
}
