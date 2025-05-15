import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5; /* Matte background */
`;

const Box = styled.div`
  width: 300px;
  padding: 2rem;
  background-color: #ffffff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HomeLink = styled(Link)`
  margin-top: 1rem;
  color: #0077ff;
  font-size: 1rem;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: #005bb5;
  }
`;

export default function NotFound() {
  return (
    <Container>
      <Box>
        <h1 style={{ fontSize: "1.5rem", color: "#333333" }}>
          404 - Page Not Found
        </h1>
        <HomeLink to="/">Go back to Home</HomeLink>
      </Box>
    </Container>
  );
}
