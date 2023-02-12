import { useState, useEffect } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getNowPlayingMovie,
  getPopularMovie,
  getTopRatedMovie,
  getUpcomingMovie,
  IGetMoviesResult,
} from "../api/MovieApi";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import Ticketing from "./Ticketing";
import BigMovie from "./BigMovie";
import Slider from "../Components/MovieSlider";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.black.darker};
  height: 250vh;
  overflow-x: hidden;
`;

const Banner = styled.div<{ bgphoto: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  padding: 0px 75px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), #181818),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;
const BannerTitle = styled.h2`
  font-size: 60px;
  font-weight: 600;
  margin-bottom: 20px;
`;
const BannerOverview = styled.p`
  font-size: 20px;
  width: 50%;
  margin-bottom: 30px;
`;
const BannerButtons = styled.div`
  display: flex;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    border: none;
    border-radius: 10px;
    width: 160px;
    height: 50px;
    margin-right: 10px;
    &:hover {
      cursor: pointer;
      opacity: 0.7;
    }
    svg {
      width: 25px;
      margin-right: 10px;
    }
  }
  button:last-child {
    color: white;
    background-color: rgba(109, 109, 110, 0.7);
  }
`;

function Movie() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("movie/details/:movieId");
  //   const ticketingMatch = useMatch("/movies/ticketing/:movieId");
  const { data: nowPlayingMovieData, isLoading: nowPlayingMovieLoading } =
    useQuery<IGetMoviesResult>("nowPlaying", getNowPlayingMovie);
  const { data: popularMovieData, isLoading: popularMovieLoading } =
    useQuery<IGetMoviesResult>("popular", getPopularMovie);
  const { data: topRatedMovieData, isLoading: topRatedMovieLoading } =
    useQuery<IGetMoviesResult>("topRated", getTopRatedMovie);
  const { data: upcomingMovieData, isLoading: upcomingMovieLoading } =
    useQuery<IGetMoviesResult>("upComing", getUpcomingMovie);
  const onBoxClicked = (movieId: number) => {
    navigate(`details/${movieId}`, { state: { layoutId: "banner" } });
  };
  return (
    <Wrapper>
      <Banner
        bgphoto={makeImagePath(
          nowPlayingMovieData?.results[0].backdrop_path || ""
        )}
      >
        <BannerTitle>{nowPlayingMovieData?.results[0].title}</BannerTitle>
        <BannerOverview>
          {nowPlayingMovieData?.results[0].overview}
        </BannerOverview>
        <BannerButtons>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
            </svg>
            <span>예매하기</span>
          </button>
          <button
            onClick={() =>
              onBoxClicked(nowPlayingMovieData?.results[0].id || 0)
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z" />
            </svg>
            <span>상세 정보</span>
          </button>
        </BannerButtons>
      </Banner>
      {nowPlayingMovieData ? (
        <Slider
          key="nowPlayingMovie"
          category={"현재 상영작"}
          results={nowPlayingMovieData.results}
          isLoading={nowPlayingMovieLoading}
        />
      ) : null}
      {popularMovieData ? (
        <Slider
          key="popularMovie"
          category={"인기 상영작"}
          results={popularMovieData.results}
          isLoading={popularMovieLoading}
        />
      ) : null}
      {topRatedMovieData ? (
        <Slider
          key="topRatedMovie"
          category={"최고 별점순"}
          results={topRatedMovieData.results}
          isLoading={topRatedMovieLoading}
        />
      ) : null}
      {upcomingMovieData ? (
        <Slider
          key="upcomingMovie"
          category={"개봉 예정작"}
          results={upcomingMovieData.results}
          isLoading={upcomingMovieLoading}
        />
      ) : null}
      {bigMovieMatch ? <BigMovie /> : null}
      {/* {ticketingMatch ? <Ticketing /> : null} */}
    </Wrapper>
  );
}

export default Movie;