import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  getSearchMovies,
  IGetMoviesResult,
} from "../api/MovieApi";
import { getSearchTv, IGetTvResult } from "../api/TvApi";
import { Box, BoxInfo, boxVariants, infoVariants } from "../Components/Slider";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.black.darker};
  height: 300vh;
  overflow-x: hidden;
`;

const SearchTitle = styled.div`
  /* border: 1px solid red; */
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  top: 150px;
  left: 75px;
  width: 90%;
  font-size: 35px;
  div:last-child {
    font-size: 20px;
    span {
      cursor: pointer;
    }
  }
`;
const Result = styled.div`
  /* border: 1px solid red; */
  position: absolute;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  column-gap: 5px;
  row-gap: 50px;
  width: 90%;
  left: 0;
  right: 0;
  top: 230px;
  margin: 0 auto;
`;

function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const [isMovie, setIsMovie] = useState(true);
  const { data: searchMovieData, isLoading: searchMovieLoading } =
    useQuery<IGetMoviesResult>(["searchMovie", keyword], () =>
      getSearchMovies(keyword || "")
    );
  const { data: searchTvData, isLoading: searchTvLoading } =
    useQuery<IGetTvResult>(["searchTv", keyword], () =>
      getSearchTv(keyword || "")
    );
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`, {
      state: { layoutId: "search" },
    });
  };
  console.log(searchTvData);
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
              </motion.span>{" "}
              |{" "}
              <motion.span
                onClick={() => setIsMovie(false)}
                animate={{ opacity: isMovie ? 1 : 0.5 }}
              >
                TV
              </motion.span>
            </div>
          </SearchTitle>
          <Result>
            {isMovie
              ? searchMovieData?.results.map((movie) =>
                  movie.backdrop_path ? (
                    <Box
                      onClick={() => onBoxClicked(movie.id)}
                      key={movie.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(movie.backdrop_path)}
                    >
                      <BoxInfo key={movie.id} variants={infoVariants}>
                        <span>{movie.title}</span>
                      </BoxInfo>
                    </Box>
                  ) : null
                )
              : searchTvData?.results.map((tv) =>
                  tv.backdrop_path ? (
                    <Box
                      key={tv.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(tv.backdrop_path)}
                      // style={{ border: "1px solid blue" }}
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
    </Wrapper>
  );
}

export default Search;
