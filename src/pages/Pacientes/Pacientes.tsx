import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../../utils/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Paciente {
  id: number;
  name: string;
  birth: string;
  sex: string;
  address: string;
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

export default function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await api.get("/pacientes");
        setPacientes(response.data.data);
        console.log("Pacientes:", typeof response.data.data);
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
      }
    };

    fetchPacientes();
  }, []);

  const handleCreatePaciente = () => {
    console.log("Criando novo paciente");
  };

  const handleEditPaciente = (id: number) => {
    console.log("Editando paciente com ID:", id);
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar a data:", error);
      return "Data inválida";
    }
  };

  return (
    <Container>
      <Header>
        <Title>Pacientes</Title>
        <ButtonGroup>
          <Button onClick={() => navigate("/")}>Voltar</Button>
          <Button onClick={handleCreatePaciente}>Novo Paciente</Button>
        </ButtonGroup>
      </Header>

      {pacientes.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Nome</Th>
              <Th>Nascimento</Th>
              <Th>Sexo</Th>
              <Th>Endereço</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((paciente) => (
              <tr key={paciente.id}>
                <Td>{paciente.id}</Td>
                <Td>{paciente.name}</Td>
                <Td>{formatDate(paciente.birth)}</Td>
                <Td>{paciente.sex}</Td>
                <Td>{paciente.address}</Td>
                <Td style={{ textAlign: "right" }}>
                  <Button onClick={() => handleEditPaciente(paciente.id)}>
                    Editar
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>Nenhum paciente cadastrado.</p>
      )}
    </Container>
  );
}
