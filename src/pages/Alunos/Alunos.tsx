import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";

interface Aluno {
  id: number;
  coordenacao_id: number;
  coordenacao_name: string;
  name: string;
}

interface Coordenacao {
  id: number;
  name: string;
}

// Interface for new aluno form data
interface NewAlunoData {
  name: string;
  coordenacao_id: number | "";
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

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
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

// Modal Styles
const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #555;
    font-weight: bold;
  }

  input,
  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
`;

export default function Alunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [coordenacoes, setCoordenacoes] = useState<Coordenacao[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAlunoData, setNewAlunoData] = useState<NewAlunoData>({
    name: "",
    coordenacao_id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await api.get("/alunos");
        setAlunos(response.data.data);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    };

    const fetchCoordenacoes = async () => {
      try {
        const response = await api.get("/coordenacao");
        setCoordenacoes(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Erro ao buscar coordenações:", error);
      }
    };

    fetchAlunos();
    fetchCoordenacoes();
  }, []);

  const handleCreateAluno = () => {
    setIsModalOpen(true);
    setNewAlunoData({ name: "", coordenacao_id: "" }); // Reset form
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewAlunoData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...newAlunoData,
        coordenacao_id: Number(newAlunoData.coordenacao_id),
      };
      await api.post("/alunos", payload);
      await (async () => {
        try {
          const response = await api.get("/alunos");
          setAlunos(response.data.data);
        } catch (error) {
          console.error("Erro ao buscar alunos:", error);
        }
      })(); // Reload data after successful creation
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Erro ao criar aluno:", error);
      alert("Erro ao criar aluno. Verifique os dados e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAluno = (id: number) => {
    navigate(`/alunos/edit/${id}`);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } },
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

      {/* Create Aluno Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <ModalOverlay
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleModalClose} // Close when clicking outside
          >
            <ModalContent
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <ModalTitle>Novo Aluno</ModalTitle>
              <form onSubmit={handleFormSubmit}>
                <FormGroup>
                  <label htmlFor="name">Nome:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newAlunoData.name}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="coordenacao_id">Coordenação:</label>
                  <select
                    id="coordenacao_id"
                    name="coordenacao_id"
                    value={newAlunoData.coordenacao_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione uma coordenação</option>
                    {coordenacoes.map((coordenacao) => (
                      <option key={coordenacao.id} value={coordenacao.id}>
                        {coordenacao.name}
                      </option>
                    ))}
                  </select>
                </FormGroup>
                <ModalActions>
                  <Button
                    type="button"
                    onClick={handleModalClose}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Confirmar"}
                  </Button>
                </ModalActions>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
}
