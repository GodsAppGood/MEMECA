import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/404";
import ServerError from "./pages/500";
import Home from "./pages/Home";
import MyMemes from "./pages/MyMemes";
import Privacy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Tuzemoon from "./pages/Tuzemoon";
import Watchlist from "./pages/Watchlist";
import TopMemes from "./pages/TopMemes";
import MyStory from "./pages/MyStory";
import SubmitMeme from "./pages/SubmitMeme";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-memes" element={<MyMemes />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/tuzemoon" element={<Tuzemoon />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/top-memes" element={<TopMemes />} />
        <Route path="/my-story" element={<MyStory />} />
        <Route path="/submit-meme" element={<SubmitMeme />} />
        <Route path="/500" element={<ServerError />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;