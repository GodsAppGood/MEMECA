import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/404";
import ServerError from "./pages/500";
import Home from "./pages/Home"; // Example of an existing route
import About from "./pages/About"; // Example of an existing route
import Contact from "./pages/Contact"; // Example of an existing route

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/500" element={<ServerError />} />
      </Routes>
    </Router>
  );
}

export default App;
