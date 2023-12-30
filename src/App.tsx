import SelectInputSideBar from "./components/SelectInputSideBar";

export default function App() {
  function onRun(s: string) {
    alert(s);
  }

  return (
    <>
      <div className="h-full flex flex-row bg-black">
        <main className="flex-auto bg-green-200"></main>
        <SelectInputSideBar onRun={onRun} />
      </div>
    </>
  );
}
