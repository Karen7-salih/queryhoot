import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import Presenter from "./components/pages/Presenter";
import Player from "./components/pages/Player";
import Board from "./components/pages/Board";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/presenter" element={<Presenter />} />
      <Route path="/player" element={<Player />} />
      <Route path="/board" element={<Board />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
