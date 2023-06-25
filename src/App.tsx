import "./App.css";
import Heatmap from "./Heatmap.tsx";
import Typewriter from "typewriter-effect";

function App() {
  return (
    <>
      <h1>
        <Typewriter
          options={{
            wrapperClassName: "Typewriter__wrapper",
            cursorClassName: "Typewriter__cursor",
            strings: ["word count"],
            autoStart: true,
            loop: true,
          }}
        />
      </h1>
      <Heatmap />
    </>
  );
}

export default App;
