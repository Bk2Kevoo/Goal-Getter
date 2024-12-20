import styled from 'styled-components';
import { Link } from 'react-router-dom'; 


function About() {
  return (
    <AboutContainer>
      <ContentWrapper>
        <Title>About Goal Getter</Title>
        <Description>
          Goal Getter is your personal financial companion, designed to help you take charge of your spending, savings, and financial aspirations. 
          We believe that every dollar should have a purpose, and Goal Getter is here to empower you to set and achieve your financial goals 
          with confidence and clarity.
        </Description>
        <Features>
          <FeatureTitle>Why Choose Goal Getter?</FeatureTitle>
          <ul>
            <li>🧾<strong>Track Expenses:</strong> Easily monitor your daily, weekly, and monthly spending habits.</li>
            <li>💰<strong>Set Goals:</strong> Define savings targets for your short-term and long-term dreams.</li>
            <li>📊<strong>Visual Insights:</strong> Get detailed visual breakdowns of your income and spending patterns.</li>
            <li>🔒<strong>Secure & Reliable:</strong> Your financial data is encrypted and safe with us.</li>
            <li>🌟<strong>User-Friendly:</strong> Designed with simplicity in mind to make budgeting easy for everyone.</li>
          </ul>
        </Features>
        <CallToAction>
          Ready to take control of your finances?{' '}
          <StyledLink to="/register">Start your journey with Goal Getter today!</StyledLink>
        </CallToAction>
      </ContentWrapper>
    </AboutContainer>
  );
}

export default About;

// Styled Components
const AboutContainer = styled.div`
  height: 100vh;
  width: 100%;
  background: linear-gradient(to right, #6a11cb, #2575fc);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #fff;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  text-align: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  font-size: 2.8rem;
  margin-bottom: 1rem;
  color: #ffdd57;
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.8;
`;

const Features = styled.div`
  text-align: left;
  margin-top: 2rem;

  ul {
    list-style-type: none;
    padding: 0;

    li {
      font-size: 1.1rem;
      margin: 0.8rem 0;
      display: flex;
      align-items: center;
    }

    strong {
      margin-left: 0.5rem;
      color: #ffdd57;
    }
  }
`;

const FeatureTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #ffdd57;
`;

const CallToAction = styled.p`
  font-size: 1.4rem;
  margin-top: 2rem;
  font-weight: bold;

  span {
    color: #ffdd57;
    text-decoration: underline;
    cursor: pointer;
  }
`;
const StyledLink = styled(Link)`
  color: #ffdd57;
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: #ffe670;
  }
`;