import { useState } from "react";
import LandingPage from "./LandingPage";
import GeneratorPage from "./GeneratorPage";

function App() {
  const [started, setStarted] = useState(false);
  console.log("Started:", started);

  return (
    <>
      {started ? (
        <GeneratorPage />
      ) : (
        <LandingPage onStart={() => setStarted(true)} />
      )}
    </>
  );
}

export default App;
