import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import SignIn from "./components/SignIn";
import MediaSelection from "./pages/Choices";
import Footer from "./components/Footer";
import ResetPassword from "./pages/ResetPassword"; 
import Movies from "./pages/Movies";
import Books from "./pages/Books"; 
import Music from "./pages/Music";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <Routes>
        {/* Landing / Auth / Reset pages (no NavBar) */}
        <Route path="/" element={<Landing />} />
        <Route
          path="/signin"
          element={
            <>
              <SignIn />
              <Footer />
            </>
          }
        />
        <Route
          path="/choices"
          element={
            <>
              <MediaSelection />
              <Footer />
            </>
          }
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Main pages with NavBar */}
        <Route
          path="/*"
          element={
            <>
              <NavBar />
              <Routes>
                <Route path="movies" element={<Movies />} />
                <Route path="books" element={<Books />} />
                <Route path="music" element={<Music />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
