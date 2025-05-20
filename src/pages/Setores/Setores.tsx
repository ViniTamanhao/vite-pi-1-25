import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../../utils/api";

interface Setor {
  id: number;
  name: string;
}

const Container = styled.div`
  padding: 2rem;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #0077ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #005bb5;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
`;

const SetoresPage = () => {
  const [setores, setSetores] = useState<Setor[]>([]);
  const navigate = useNavigate();

  const fetchSetores = useCallback(async () => {
    try {
      const response = await api.get("/setores");
      setSetores(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar setores:", error);
    }
  }, []);

  useEffect(() => {
    fetchSetores();
  }, [fetchSetores]);

  const handleCreateSetor = () => {
    navigate("/setores/create");
  };

  const handleEditSetor = (id: number) => {
    navigate(`/setores/edit/${id}`);
  };

  return (
    <Container>
      <Header>
        <Title>Setores</Title>
        <ButtonGroup>
          <Button onClick={() => navigate("/")}>Voltar</Button>
          <Button onClick={handleCreateSetor}>Novo Setor</Button>
        </ButtonGroup>
      </Header>

      {setores.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Nome</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {setores.map((setor) => (
              <tr key={setor.id}>
                <Td>{setor.id}</Td>
                <Td>{setor.name}</Td>
                <Td style={{ textAlign: "right" }}>
                  <Button onClick={() => handleEditSetor(setor.id)}>
                    Editar
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>Nenhum setor encontrado.</p>
      )}
    </Container>
  );
};

export default SetoresPage;
