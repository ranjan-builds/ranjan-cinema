// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Movie from "./pages/movie";
import Person from "./pages/Person";
import SavedMovies from "./pages/SavedMovies";
import About from "./pages/About";
import Discover from "./pages/Discover";
import Explore from "./pages/Explore";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<Movie />} />
          <Route path="/Person/:id" element={<Person />} />
          <Route path="/SavedMovies" element={<SavedMovies />} />
          <Route path="/about" element={<About />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/explore" element={<Explore />} />
        </Routes>
      </Layout>
    </Router>
  );
}
