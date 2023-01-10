import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getCredits,
  getMovieDetails,
  getNowPlaying,
  IGetCredits,
  IGetMovieDetails,
  IGetMoviesResult,
} from "../api";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { click } from "@testing-library/user-event/dist/click";
import Ticketing from "./Ticketing";

const Wrapper = styled.div`
  background-color: black;
  height: 300vh;
  overflow-x: hidden;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20vh;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  padding: 0px 75px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const BannerTitle = styled.h2`
  font-size: 58px;
  margin-bottom: 20px;
`;

const BannerOverview = styled.p`
  font-size: 20px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  /* top: -200px; */
  width: 100%;
  height: 130px;
  border: 1px solid blue;
`;

const SliderTitle = styled.div`
  position: absolute;
  top: -50px;
  left: 75px;
  font-size: 30px;
`;

const Row = styled(motion.div)`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  width: 90%;
  left: 0;
  right: 0;
  margin: 0 auto;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 130px;
  border-radius: 5px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  position: absolute;
  width: 100%;
  background-color: grey;
  padding: 10px 0px;
  opacity: 0;
  top: 100px;
  h4 {
    text-align: center;
    font-size: 15px;
  }
`;

const SliderController = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5%;
  height: 100%;
  &:hover {
    cursor: pointer;
    opacity: 0.5;
  }
  svg {
    height: 40px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 55vw;
  height: 85vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.darker};
  overflow: scroll;
  overflow-x: hidden;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    height: 30%;
    background-color: ${props=>props.theme.black.lighter};
    border-radius: 15px;
  }
  &::-webkit-scrollbar-track {
    background-color: ${props => props.theme.black.darker};
  }
`;

const BigCover = styled.div<{ bgPhoto: string }>`
  height: 400px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), #181818),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: top center;
`;

const BigInfo = styled.div`
  display: flex;
  padding: 30px 50px;
  & > div:first-child {
    width: 800px;
    padding-right: 30px;
  }
`;

const BigTitle = styled.h3`
  position: absolute;
  top: 200px;
  left: 50px;
  font-size: 45px;
  color: ${(props) => props.theme.white.lighter};
  div {
    padding-top: 10px;
    padding-left: 5px;
    font-size: 20px;
  }
`;
const ReserveButton = styled(motion.button)`
  position: absolute;
  top: 320px;
  left: 50px;
  width: 130px;
  height: 50px;
  border-radius: 10px;
  font-size: 20px;
  background-color: white;
  &:hover {
    cursor: pointer;
    background-color: #ececec;
  }
`;
const BigDetail = styled.div`
  /* border-left: 3px solid white;
  padding-left: 15px; */
  width: 400px;
  margin-bottom: 30px;
  font-size: 20px;
`;

const BigOverview = styled.div`
  font-size: 15px;
  line-height: 1.5;
  color: ${(props) => props.theme.white.lighter};
  word-break: keep-all;
  div {
    /* border-left: 3px solid white;
    padding-left: 15px; */
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
  }
`;
const BigCredits = styled.div`
  margin-bottom: 20px;
  font-size: 15px;
`;
const BigGenre = styled.div`
  font-size: 15px;
`;

const rowVariants = {
  hidden: (isBack: boolean) => ({
    x: isBack ? -window.outerWidth : window.outerWidth,
  }),
  visible: {
    x: 0,
  },
  exit: (isBack: boolean) => ({
    x: isBack ? window.outerWidth : -window.outerWidth,
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.3,
      type: "tween",
    },
  },
};

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const ticketingMatch = useMatch("/movies/ticketing/:movieId");
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    "nowPlaying",
    getNowPlaying
  );
  const { data: clickedMovie } = useQuery<IGetMovieDetails>(
    ["movieDetails", bigMovieMatch?.params.movieId],
    () => getMovieDetails(String(bigMovieMatch?.params.movieId))
  );
  const { data: creditData } = useQuery<IGetCredits>(
    ["credits", bigMovieMatch?.params.movieId],
    () => getCredits(String(bigMovieMatch?.params.movieId))
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const offset = 6;
  const increaseIndex = () => {
    setIsBack(false);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    setIsBack(true);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClick = () => navigate("/");
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <BannerTitle>{data?.results[0].title}</BannerTitle>
            <BannerOverview>{data?.results[0].overview}</BannerOverview>
          </Banner>
          <Slider>
            <SliderTitle>현재 상영작</SliderTitle>
            <AnimatePresence
              custom={isBack}
              initial={false}
              onExitComplete={toggleLeaving}
            >
              <Row
                custom={isBack}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                key={index}
                transition={{ type: "tween", duration: 0.8 }}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      onClick={() => onBoxClicked(movie.id)}
                      variants={boxVariants}
                      key={movie.id}
                      layoutId={String(movie.id)}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.backdrop_path)}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
              <SliderController
                key="left"
                onClick={decreaseIndex}
                style={{ left: 0 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  fill="white"
                >
                  <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                </svg>
              </SliderController>
              <SliderController
                key="right"
                onClick={increaseIndex}
                style={{ right: 0 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  fill="white"
                >
                  <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                </svg>
              </SliderController>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 50 }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        bgPhoto={makeImagePath(clickedMovie.backdrop_path)}
                      >
                        <BigTitle>
                          {clickedMovie.title}
                          <div>{clickedMovie.original_title}</div>
                        </BigTitle>
                        <ReserveButton
                          onClick={() =>
                            navigate(`/movies/ticketing/${clickedMovie.id}`)
                          }
                        >
                          예매하기
                        </ReserveButton>
                      </BigCover>
                      <BigInfo>
                        <div>
                          <BigDetail>
                            <span>
                              {clickedMovie.release_date.split("-")[0]}
                            </span>
                            &nbsp;&nbsp;•&nbsp;&nbsp;
                            <span>
                              {`${Math.floor(clickedMovie.runtime / 60)}시간 ${
                                clickedMovie.runtime % 60
                              }분`}
                            </span>
                            &nbsp;&nbsp;•&nbsp;&nbsp;
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                                fill="red"
                                style={{ width: "20px" }}
                              >
                                <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                              </svg>{" "}
                              {Math.round(clickedMovie.vote_average * 10) / 10}
                            </span>
                          </BigDetail>
                          <BigOverview>
                            <div>{clickedMovie.tagline}</div>
                            {clickedMovie.overview}
                          </BigOverview>
                        </div>
                        <div>
                          <BigCredits>
                            출연:{" "}
                            {creditData?.cast
                              .slice(0, 3)
                              .map((cast) => `${cast.name}, `)}
                          </BigCredits>
                          <BigGenre>
                            장르:{" "}
                            {clickedMovie.genres.map(
                              (genre) => `${genre.name}, `
                            )}
                          </BigGenre>
                        </div>
                      </BigInfo>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
          {ticketingMatch ? <Ticketing /> : null}
        </>
      )}
    </Wrapper>
  );
}

export default Home;
