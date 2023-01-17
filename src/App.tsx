import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from "./Components/Header";
import BigMovie from "./Routes/BigMovie";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Ticketing from "./Routes/Ticketing";
import Tv from "./Routes/Tv";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="movies/:movieId" element={<BigMovie />} />
          <Route path="movies/ticketing/:movieId" element={<Ticketing />} />
        </Route>
        <Route path="/movie">
          <Route path="details/:movieId" element={<BigMovie />} />
        </Route>
        <Route path="/tv" element={<Tv />}>
          {/* <Route path="tvShows/:tvId" element={<BigTv />} /> */}
        </Route>
        <Route path="/search" element={<Search />}>
          <Route path="movies/:movieId" element={<BigMovie />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
