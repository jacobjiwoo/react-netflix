import styled from "styled-components";

const Wrapper = styled.div`
  border: 1px solid blue;
  position: absolute;
  width: 50vw;
  height: 50vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: yellow;
  overflow: scroll;
  overflow-x: hidden;
`;

function Ticketing() {
  return <Wrapper />;
}

export default Ticketing;
