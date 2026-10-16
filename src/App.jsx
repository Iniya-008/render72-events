import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

const EventDetail = lazy(() => import("./pages/EventDetail"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event/:id" element={<EventDetail />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;