import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar";
import Home from "./page/Home";
import CVATSParser from "./page/cv-ats-parser";
import BatchDetail from "./page/BatchDetail";


function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/batch/:batch_id" element={<CVATSParser />} />
        <Route path="/batch/:batch_id/filter" element={<BatchDetail />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-100 overflow-y-auto">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}
