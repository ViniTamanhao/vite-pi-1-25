/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api"; // Make sure this path is correct

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

const Back = styled.button`
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
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 2rem;
  background-color: #ffffff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 1.5rem;
  color: #333333;
  margin-bottom: 1.5rem;
`;

const StatItem = styled.div`
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #333;
`;

export default function Dados() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchPareceres() {
      try {
        const response = await api.get("/pareceres");
        const data = response.data.data;

        const total = data.length;
        const countBySetor: Record<string, number> = {};

        data.forEach((item: any) => {
          const setor = item.setor_name || "Desconhecido";
          countBySetor[setor] = (countBySetor[setor] || 0) + 1;
        });

        // Convert counts to percentages
        const percentageBySetor: Record<string, number> = {};
        for (const [setor, count] of Object.entries(countBySetor)) {
          percentageBySetor[setor] = parseFloat(
            ((count / total) * 100).toFixed(1)
          );
        }

        setStats(percentageBySetor);
      } catch (error) {
        console.error("Error fetching pareceres:", error);
      }
    }

    fetchPareceres();
  }, []);

  return (
    <Container>
      <TopBar>
        <Back onClick={() => navigate("/")}>Voltar</Back>
      </TopBar>
      <Center>
        <Box>
          <Title>Porcentagem de parecer por Setor</Title>
          {Object.entries(stats).map(([setor, percentage]) => (
            <StatItem key={setor}>
              <strong>{setor}:</strong> {percentage}%
            </StatItem>
          ))}
        </Box>
      </Center>
    </Container>
  );
}
