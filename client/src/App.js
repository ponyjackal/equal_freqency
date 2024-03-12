import "./App.css";
import Layout from "./layout";

let layouts = Array.from({ length: 100 }, (_, i) => i + 1);

function App() {
  return (
    <div className="App">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "10px",
        }}
      >
        {layouts.map((layout) => (
          <Layout key={layout} />
        ))}
      </div>
    </div>
  );
}

export default App;
