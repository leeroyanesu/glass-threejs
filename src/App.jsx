import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";

function App() {
  return (
    <>
      <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#202020", 5, 15]} />
        <Experience />
      </Canvas>
      <div style={{
        position: "fixed",
        inset: 0,
        background: "radial-gradient(circle at center, #404040 0%, #000000 100%)",
        zIndex: -1,
      }} />
    </>
  );
}

export default App;
