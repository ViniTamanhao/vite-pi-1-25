import { useContext, useState } from "react";
import { AuthContext } from "../../context/auth";
import styled, { keyframes } from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
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

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #cccccc;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #0077ff;
  }
`;

const Button = styled.button<{ $isLoading: boolean }>`
  width: 100%;
  padding: 0.75rem;
  background-color: #0077ff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: ${({ $isLoading }) => ($isLoading ? "not-allowed" : "pointer")};
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ $isLoading }) =>
      $isLoading ? "#0077ff" : "#005bb5"};
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

const ErrorMessage = styled.p`
  color: #ff4d4f;
  margin-top: 1rem;
  font-size: 0.875rem;
`;

export default function Login() {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      await login(name, pwd);
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed: Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Box>
        <h1 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>Login</h1>

        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />

        <Input
          type="password"
          placeholder="Password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          disabled={isLoading}
        />

        <Button
          onClick={handleLogin}
          $isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : "Login"}
        </Button>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Box>
    </Container>
  );
}
