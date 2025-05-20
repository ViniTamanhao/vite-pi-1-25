import styled from "styled-components";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth";

const Container = styled.div`
  height: 100vh;
  background-color: #f5f5f5;
  position: relative;
`;

const TopBar = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #cc0000;
  }
`;

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Box = styled.div`
  width: 320px;
  padding: 2rem;
  background-color: #ffffff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #333333;
  margin-bottom: 1.5rem;
`;

const NavButton = styled(Link)`
  width: 100%;
  padding: 0.75rem 1rem;
  margin: 0.5rem 0;
  background-color: #0077ff;
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 6px;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #005bb5;
  }
`;

export default function Home() {
  const { logout } = useContext(AuthContext);

  return (
    <Container>
      <TopBar>
        <LogoutButton onClick={logout}>Logout</LogoutButton>
      </TopBar>
      <Center>
        <Box>
          <Title>Bem-vindo</Title>
          <NavButton to="/pacientes">Pacientes</NavButton>
          <NavButton to="/alunos">Alunos</NavButton>
          <NavButton to="/pareceres">Pareceres</NavButton>
          <NavButton to="/setores">Setores</NavButton>
        </Box>
      </Center>
    </Container>
  );
}
