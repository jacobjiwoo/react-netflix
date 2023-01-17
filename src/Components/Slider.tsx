import { AnimatePresence, motion } from "framer-motion";
import { stringify } from "querystring";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getMovieDetails,
  IGetMovieDetails,
  IGetMoviesResult,
  IMovie,
} from "../api/MovieApi";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 130px;
  margin-bottom: 100px;
`;

const Loader = styled.div`
  font-size: 30px;
`;

const SliderTitle = styled.div`
  position: absolute;
  top: -50px;
  left: 75px;
  font-size: 30px;
`;
const SliderContainer = styled.div`
  width: 100%;
  height: 100%;
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
export const Box = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
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

export const BoxInfo = styled(motion.div)`
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

export const boxVariants = {
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

export const infoVariants = {
  hover: {
    display: "block",
    opacity: 1,
    transition: {
      delay: 0.3,
      type: "tween",
    },
  },
};

function Slider({
  category,
  results,
  isLoading,
}: {
  category: string;
  results: IMovie[]
  isLoading: boolean;
}) {
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const offset = 6;
  const increaseIndex = () => {
    setIsBack(false);
    if (results) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    setIsBack(true);
    if (results) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`, {
      state: { layoutId: `${category}_${movieId}` },
    });
  };
  console.log(leaving);
  return (
    <Wrapper>
      <SliderTitle>{category}</SliderTitle>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <SliderContainer
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <AnimatePresence
              custom={isBack}
              initial={false}
              onExitComplete={() => setLeaving(false)}
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
                {results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      onClick={() => {
                        onBoxClicked(movie.id);
                      }}
                      key={movie.id}
                      variants={boxVariants}
                      // layoutId={`${category}_${movie.id}`}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(movie.backdrop_path)}
                    >
                      <BoxInfo key={movie.id} variants={infoVariants}>
                        <span>{movie.title}</span>
                      </BoxInfo>
                    </Box>
                  ))}
              </Row>
              {isHover ? (
                <>
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
                </>
              ) : null}
            </AnimatePresence>
          </SliderContainer>
        </>
      )}
    </Wrapper>
  );
}

export default Slider;
