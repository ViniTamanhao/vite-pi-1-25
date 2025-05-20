import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../../utils/api";

interface Aluno {
  id: number;
  coordenacao_id: number;
  coordenacao_name: string;
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

export default function Alunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await api.get("/alunos");
        setAlunos(response.data.data);
        console.log("Alunos:", response.data.data);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    };

    fetchAlunos();
  }, []);

  const handleCreateAluno = () => {
    navigate("/alunos/create");
  };

  const handleEditAluno = (id: number) => {
    navigate(`/alunos/edit/${id}`);
  };

  return (
    <Container>
      <Header>
        <Title>Alunos</Title>
        <ButtonGroup>
          <Button onClick={() => navigate("/")}>Voltar</Button>
          <Button onClick={handleCreateAluno}>Novo Aluno</Button>
        </ButtonGroup>
      </Header>

      {alunos.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Coordenação</Th>
              <Th>Nome</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((aluno) => (
              <tr key={aluno.id}>
                <Td>{aluno.id}</Td>
                <Td>{aluno.coordenacao_name}</Td>
                <Td>{aluno.name}</Td>
                <Td style={{ textAlign: "right" }}>
                  <Button onClick={() => handleEditAluno(aluno.id)}>
                    Editar
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>Nenhum aluno encontrado.</p>
      )}
    </Container>
  );
}
