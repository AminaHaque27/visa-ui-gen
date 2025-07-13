import { useState } from "react";
import LandingPage from "./LandingPage";

function App() {
  const [started, setStarted] = useState(false);

  return (
    <>
      {started ? (
        <div className="p-6">💡 Replace this with your Generator Page</div>
      ) : (
        <LandingPage onStart={() => setStarted(true)} />
      )}
    </>
  );
}

export default App;
