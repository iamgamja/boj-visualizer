import { useEffect, useRef, useState } from "react";
import Simulation from "./components/Simulation";
import { simulation } from "./constants/const";

const modules = import.meta.glob("./data/*.{ts,js}", { eager: true }) as Record<
  string,
  simulation
>; // path: simulation

export default function App() {
  const [name, setName] = useState<string | null>();
  console.log(name);
  const simulations = useRef<Record<string, simulation>>({}); // name: simulation

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setName(urlParams.get("s"));

    Object.values(modules).forEach((module) => {
      simulations.current[module.data.name] = module;
    });
  }, []);

  if (name && name in simulations.current) {
    return (
      <>
        <Simulation
          data={simulations.current[name].data}
          steps={simulations.current[name].steps}
          stepNames={simulations.current[name].stepNames}
          parseBoard={simulations.current[name].parseBoard}
        />
      </>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col">
        <h2 className="p-16 font-bold text-5xl text-center">BOJ Visualizer</h2>
        {Object.keys(simulations.current).map((name) => (
          <a
            href={`./?s=${name}`}
            className="p-5 m-5 rounded-md bg-gray-400"
            key={name}
          >
            {name}
          </a>
        ))}
      </div>
    </>
  );
}
