import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/v1" element={<Home />} />
      <Route path="*" element={<Navigate to="/v1" replace />} />
    </Routes>
  );
}

export default App;
