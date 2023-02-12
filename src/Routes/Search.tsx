import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import {
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from "react-router-dom";
import styled from "styled-components";
import { getMovieSearch, IGetMoviesResult } from "../api/MovieApi";
import { getTvSearch, IGetTvResult } from "../api/TvApi";
import { makeImagePath } from "../utils";
import BigMovie from "./BigMovie";
import BigTv from "./BigTv";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.black.darker};
  height: 100vh;
  overflow-y: auto;
  box-sizing: border-box;
`;

const SearchTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  margin: 0px 75px;
  margin-top: 100px;
  font-size: 35px;
  div:last-child {
    font-size: 20px;
    span {
      cursor: pointer;
    }
  }
`;
const Result = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  column-gap: 5px;
  row-gap: 50px;
  width: 90%;
  margin: 30px 75px;
  margin-bottom: 50px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${(props) => props.bgphoto});
  background-color: #2f2f2f;
  background-size: cover;
  background-position: center center;
  height: 130px;
  border-radius: 5px;
  cursor: pointer;
  svg {
    width: 40px;
    height: 40px;
  }
`;

const BoxInfo = styled(motion.div)`
  position: absolute;
  display: none;
  bottom: 0px;
  width: 100%;
  height: 130px;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
  border-radius: 5px;
  span {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 15px;
    margin: 0px auto;
    width: 90%;
    font-size: 15px;
    text-align: center;
    word-break: keep-all;
  }
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.5,
    zIndex: 10,
    transition: {
      delay: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    display: "block",
    opacity: 1,
    transition: {
      delay: 0.3,
      type: "tween",
    },
  },
};

function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const bigMovieMatch = useMatch("search/movie/details/:movieId");
  const bigTvMatch = useMatch("search/tv/details/:tvId");
  const keyword = new URLSearchParams(location.search).get("keyword");
  const [isMovie, setIsMovie] = useState(true);
  const { data: searchMovieData, isLoading: searchMovieLoading } =
    useQuery<IGetMoviesResult>(["searchMovie", keyword], () =>
      getMovieSearch(keyword || "")
    );
  const { data: searchTvData, isLoading: searchTvLoading } =
    useQuery<IGetTvResult>(["searchTv", keyword], () =>
      getTvSearch(keyword || "")
    );
  const onMovieBoxClicked = (movieId: number) => {
    navigate(`movie/details/${movieId}?keyword=${keyword}`, {
      state: { layoutId: "search" },
    });
  };
  const onTvBoxClicked = (tvId: number) => {
    navigate(`tv/details/${tvId}?keyword=${keyword}`, {
      state: { layoutId: "search" },
    });
  };
  useEffect(() => {
    window.scroll({ top: 0 });
  });
  return (
    <Wrapper>
      {searchMovieLoading || searchTvLoading ? (
        "Loading..."
      ) : (
        <>
          <SearchTitle>
            <div>{`${keyword} 관련 콘텐츠`}</div>
            <div>
              <motion.span
                onClick={() => setIsMovie(true)}
                animate={{ opacity: isMovie ? 0.5 : 1 }}
              >
                영화
              </motion.span>
              {" | "}
              <motion.span
                onClick={() => setIsMovie(false)}
                animate={{ opacity: isMovie ? 1 : 0.5 }}
              >
                TV 프로그램
              </motion.span>
            </div>
          </SearchTitle>
          <Result>
            {isMovie
              ? searchMovieData?.results.map((movie, index) => (
                  <Box
                    onClick={() => onMovieBoxClicked(movie.id)}
                    key={movie.id}
                    variants={boxVariants}
                    initial="normal"
                    whileHover="hover"
                    transition={{ type: "tween" }}
                    bgphoto={makeImagePath(movie.backdrop_path)}
                    style={{
                      transformOrigin:
                        (index + 1) % 6 === 0
                          ? "center right"
                          : index % 6 === 0
                          ? "center left"
                          : "center center",
                    }}
                  >
                    <span>
                      {movie.backdrop_path ? null : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="white"
                        >
                          <path d="M19.5,4H10a1,1,0,0,0,0,2H19.5a1,1,0,0,1,1,1v6.76l-1.88-1.88a3,3,0,0,0-1.14-.71,1,1,0,1,0-.64,1.9.82.82,0,0,1,.36.23l3.31,3.29a.66.66,0,0,0,0,.15.83.83,0,0,0,0,.15,1.18,1.18,0,0,0,.13.18.48.48,0,0,0,.09.11.9.9,0,0,0,.2.14.6.6,0,0,0,.11.06.91.91,0,0,0,.37.08,1,1,0,0,0,1-1V7A3,3,0,0,0,19.5,4ZM3.21,2.29A1,1,0,0,0,1.79,3.71L3.18,5.1A3,3,0,0,0,2.5,7V17a3,3,0,0,0,3,3H18.09l1.7,1.71a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42ZM4.5,7a1,1,0,0,1,.12-.46L7.34,9.25a3,3,0,0,0-1,.63L4.5,11.76Zm1,11a1,1,0,0,1-1-1V14.58l3.3-3.29a1,1,0,0,1,1.4,0L15.91,18Z" />
                        </svg>
                      )}
                    </span>
                    <BoxInfo key={movie.id} variants={infoVariants}>
                      <span>{movie.title}</span>
                    </BoxInfo>
                  </Box>
                ))
              : searchTvData?.results.map((tv) =>
                  tv.backdrop_path ? (
                    <Box
                      onClick={() => onTvBoxClicked(tv.id)}
                      key={tv.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(tv.backdrop_path)}
                    >
                      <BoxInfo key={tv.id} variants={infoVariants}>
                        <span>{tv.name}</span>
                      </BoxInfo>
                    </Box>
                  ) : null
                )}
          </Result>
        </>
      )}
      {bigMovieMatch ? <BigMovie /> : null}
      {bigTvMatch ? <BigTv /> : null}
    </Wrapper>
  );
}

export default Search;
