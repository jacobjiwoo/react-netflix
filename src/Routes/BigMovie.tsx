import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useEffect } from "react";
import { useQuery } from "react-query";
import {
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from "react-router-dom";
import styled from "styled-components";
import {
  getCredits,
  getMovieDetails,
  IGetCredits,
  IGetMovieDetails,
} from "../api/MovieApi";
import { makeImagePath } from "../utils";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
`;

const Wrapper = styled(motion.div)`
  position: absolute;
  width: 55vw;
  height: 85vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.darker};
  overflow-y: auto;
  box-sizing: border-box;
  z-index: 30;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    height: 30%;
    background-color: ${(props) => props.theme.black.lighter};
    border-radius: 15px;
  }
  &::-webkit-scrollbar-track {
    background-color: ${(props) => props.theme.black.darker};
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
const CloseButton = styled.svg`
  position: absolute;
  right: 15px;
  top: 15px;
  width: 35px;
  height: 35px;
  cursor: pointer;
`;
const ReserveButton = styled.button`
  position: absolute;
  top: 320px;
  left: 50px;
  width: 130px;
  height: 50px;
  border-radius: 10px;
  border: none;
  font-size: 20px;
  background-color: white;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
const BigDetail = styled.div`
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
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
  }
`;
const BigCredits = styled.div`
  margin-bottom: 20px;
  font-size: 15px;
  span {
    color: grey;
  }
`;
const BigGenre = styled.div`
  font-size: 15px;
  span {
    color: grey;
  }
`;

function BigMovie() {
  const location = useLocation();
  const navigate = useNavigate();
  const { movieId } = useParams();
  const { scrollY } = useScroll();
  const { data: clickedMovie, isLoading: clickedLoading } =
    useQuery<IGetMovieDetails>(["movieDetails", movieId], () =>
      getMovieDetails(Number(movieId))
    );
  const { data: creditData, isLoading: creditLoading } = useQuery<IGetCredits>(
    ["credits", movieId],
    () => getCredits(Number(movieId))
  );
  const closeBigMovie = () => {
    document.body.style.overflow = "unset";
    navigate("/")};
  useEffect(() => {
    document.body.style.overflow = "hidden";
  })
  return (
    <>
      <Overlay onClick={closeBigMovie} />
      <AnimatePresence>
        {clickedLoading || creditLoading ? null : (
          <Wrapper
            style={{ top: scrollY.get() + 50 }}
            // layoutId={location.state.layoutId}
          >
            {clickedMovie &&
              creditData &&
              (clickedLoading || creditLoading ? (
                "Loading..."
              ) : (
                <>
                  <CloseButton
                    onClick={closeBigMovie}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    fill="white"
                  >
                    <path d="M175 175C184.4 165.7 199.6 165.7 208.1 175L255.1 222.1L303 175C312.4 165.7 327.6 165.7 336.1 175C346.3 184.4 346.3 199.6 336.1 208.1L289.9 255.1L336.1 303C346.3 312.4 346.3 327.6 336.1 336.1C327.6 346.3 312.4 346.3 303 336.1L255.1 289.9L208.1 336.1C199.6 346.3 184.4 346.3 175 336.1C165.7 327.6 165.7 312.4 175 303L222.1 255.1L175 208.1C165.7 199.6 165.7 184.4 175 175V175zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z" />
                  </CloseButton>
                  <BigCover bgPhoto={makeImagePath(clickedMovie.backdrop_path)}>
                    <BigTitle>
                      {clickedMovie.title}
                      <div>{clickedMovie.original_title}</div>
                    </BigTitle>
                    <ReserveButton
                      onClick={() =>
                        navigate(`/movies/ticketing/${clickedMovie.id}`)
                      }
                    >
                      <span>예매하기</span>
                    </ReserveButton>
                  </BigCover>
                  <BigInfo>
                    <div>
                      <BigDetail>
                        <span>{clickedMovie.release_date.split("-")[0]}</span>
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
                        <span>출연: </span>
                        {creditData.cast
                          .slice(0, 3)
                          .map((cast: { name: string }) => `${cast.name}, `)}
                      </BigCredits>
                      <BigGenre>
                        <span>장르: </span>
                        {clickedMovie.genres.map((genre) => `${genre.name}, `)}
                      </BigGenre>
                    </div>
                  </BigInfo>
                </>
              ))}
          </Wrapper>
        )}
      </AnimatePresence>
    </>
  );
}

export default BigMovie;
