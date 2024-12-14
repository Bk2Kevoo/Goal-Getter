import styled from 'styled-components';

function Home() {
  return (
    <HomeContainer>
      <Overlay>
        <WelcomeMessage>
          <h1>Welcome to Goal Getter</h1>
          <p> So Why Goal Getter?</p>

        </WelcomeMessage>
      </Overlay>
    </HomeContainer>
  );
}

export default Home;

const HomeContainer = styled.div`
  height: 100vh;
  width: 100%;
//   background: url('/images/unnamed.png') no-repeat center center/cover; /* Path is relative to the public folder */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding-top: 30rem;
  padding-left: 7rem;
`;

const WelcomeMessage = styled.div`
  text-align: left;
  color: #fff;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.5rem;
    max-width: 600px;
    margin: 0 auto;
  }
`;
