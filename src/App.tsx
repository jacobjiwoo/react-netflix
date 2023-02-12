import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from "./Components/Header";
import BigMovie from "./Routes/BigMovie";
import BigTv from "./Routes/BigTv";
import Home from "./Routes/Home";
import Movie from "./Routes/Movie";
import Search from "./Routes/Search";
import Ticketing from "./Routes/Ticketing";
import Tv from "./Routes/Tv";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />}>
          <Route path="movie/details/:movieId" element={<BigMovie />} />
          <Route path="tv/details/:tvId" element={<BigTv />} />
        </Route>
        <Route path="/movie" element={<Movie />}>
          <Route path="details/:movieId" element={<BigMovie />} />
        </Route>
        <Route path="/tv" element={<Tv />}>
          <Route path="details/:tvId" element={<BigTv />} />
        </Route>
        <Route path="/search" element={<Search />}>
          <Route path="movie/details/:movieId" element={<BigMovie />} />
          <Route path="tv/details/:tvId" element={<BigTv />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
