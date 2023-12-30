import { useEffect, useState } from "react";
import index from "./assets/index.json";
import Simulation from "./components/Simulation";

export default function App() {
  const [filename, setFilename] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setFilename(urlParams.get("s"));
  }, []);

  if (filename) {
    return (
      <>
        <Simulation filename={filename} />
      </>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col">
        <h2 className="p-16 font-bold text-5xl text-center">BOJ Visualizer</h2>
        {Object.entries(index).map(([name, filename]) => (
          <a
            href={`./?s=${filename}`}
            className="p-5 m-5 rounded-md bg-gray-400"
            key={filename}
          >
            {name}
          </a>
        ))}
      </div>
    </>
  );
}
