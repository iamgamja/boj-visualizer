import SelectInputSideBar from "./components/SelectInputSideBar";

export default function App() {
  return (
    <>
      <div className="h-full flex flex-row bg-black">
        <main className="flex-auto bg-green-200"></main>
        <SelectInputSideBar />
      </div>
    </>
  );
}
