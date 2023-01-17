import { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const Wrapper = styled(motion.div)`
  border: 1px solid blue;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 50vw;
  height: 85vh;
  border-radius: 15px;
  background-color: black;
`;

const Setting = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 80%;
  height: 25%;
  background-color: white;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`;

const SeatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: 5px;
  width: 700px;
  height: 400px;
  border: 1px solid red;
`;

const Seat = styled.div`
  border-radius: 5px;
  background-color: grey;
  &:hover {
    cursor: pointer;
    background-color: purple;
  }
`;

const EmptySeat = styled.div`
  background-color: black;
`;

function Ticketing() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const movieId = useParams().movieId;
  const onOverlayClick = () => navigate("/");
  return (
    <>
      <AnimatePresence>
        <Overlay
          onClick={onOverlayClick}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        <Wrapper style={{ top: scrollY.get() + 50 }} layoutId={movieId}>
          {/* <Setting
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            transition={{ delay: 1, type: "tween" }}
          ></Setting> */}
          <SeatGrid>
            {[...Array(160)].map((_, i) => {
              const index = i + 1;
              if (index % 10 === 5 || index % 10 === 6) {
                return <EmptySeat />;
              }

              return <Seat key={index}>{index}</Seat>;
            })}
          </SeatGrid>
        </Wrapper>
      </AnimatePresence>
    </>
  );
}

export default Ticketing;
