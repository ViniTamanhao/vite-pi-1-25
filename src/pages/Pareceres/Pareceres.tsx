import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../../utils/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

interface Parecer {
  id: number;
  aluno_name: string;
  paciente_name: string;
  setor_name: string;
  num_port: number;
  solicitation_date: string;
  answer_date?: string;
  enter_date?: string;
  leave_date?: string;
  obs?: string;
}

interface Aluno {
  id: number;
  name: string;
}

interface Paciente {
  id: number;
  name: string;
}

interface Setor {
  id: number;
  name: string;
}

// Interface for the new parecer form data
interface NewParecerData {
  aluno_id: number | "";
  paciente_id: number | "";
  setor_id: number | "";
  num_port: number | "";
  solicitation_date: string;
  answer_date: string;
  enter_date: string;
  leave_date: string;
  obs: string;
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

const TdObs = styled.td`
  max-width: 20px;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
`;

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd", { locale: ptBR });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

const formatDateForInput = (dateString: string | undefined): string => {
  if (!dateString || dateString === "N/A" || dateString === "Invalid Date")
    return "";
  try {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd");
  } catch (error) {
    console.error("Error formatting date for input:", error);
    return "";
  }
};

// Modal Styles (for observation and creation)
const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const ModalContent = styled(motion.div)`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
  select,
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const PareceresPage = () => {
  const [pareceres, setPareceres] = useState<Parecer[]>([]);
  const [isObsModalOpen, setIsObsModalOpen] = useState(false);
  const [obsModalText, setObsModalText] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newParecerData, setNewParecerData] = useState<NewParecerData>({
    aluno_id: "",
    paciente_id: "",
    setor_id: "",
    num_port: "",
    solicitation_date: "",
    answer_date: "",
    enter_date: "",
    leave_date: "",
    obs: "",
  });
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [setores, setSetores] = useState<Setor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPareceres = async () => {
    try {
      const response = await api.get("/pareceres");
      setPareceres(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar pareceres:", error);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [alunosRes, pacientesRes, setoresRes] = await Promise.all([
        api.get("/alunos"),
        api.get("/pacientes"),
        api.get("/setores"),
      ]);
      setAlunos(alunosRes.data.data);
      setPacientes(pacientesRes.data.data);
      setSetores(setoresRes.data.data);
    } catch (error) {
      console.error("Erro ao buscar dados para dropdowns:", error);
    }
  };

  useEffect(() => {
    fetchPareceres();
    fetchDropdownData();
  }, []);

  const handleCreateParecer = () => {
    setIsCreateModalOpen(true);
    setNewParecerData({
      // Reset form
      aluno_id: "",
      paciente_id: "",
      setor_id: "",
      num_port: "",
      solicitation_date: "",
      answer_date: "",
      enter_date: "",
      leave_date: "",
      obs: "",
    });
  };

  const handleEditParecer = (id: number) => {
    navigate(`/pareceres/edit/${id}`);
  };

  const openObsModal = (text: string) => {
    setObsModalText(text);
    setIsObsModalOpen(true);
  };

  const closeObsModal = () => {
    setIsObsModalOpen(false);
    setObsModalText("");
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewParecerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        aluno_id: Number(newParecerData.aluno_id),
        paciente_id: Number(newParecerData.paciente_id),
        setor_id: Number(newParecerData.setor_id),
        num_port: Number(newParecerData.num_port),
        solicitation_date: newParecerData.solicitation_date,
        answer_date: newParecerData.answer_date || null,
        enter_date: newParecerData.enter_date || null,
        leave_date: newParecerData.leave_date || null,
        obs: newParecerData.obs || null,
      };

      await api.post("/pareceres", payload);
      await fetchPareceres(); // Reload data after successful creation
      setIsCreateModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Erro ao criar parecer:", error);
      alert("Erro ao criar parecer. Verifique os dados e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } },
  };

  return (
    <Container>
      <Header>
        <Title>Pareceres</Title>
        <ButtonGroup>
          <Button onClick={() => navigate("/")}>Voltar</Button>
          <Button onClick={handleCreateParecer}>Novo Parecer</Button>
        </ButtonGroup>
      </Header>

      {pareceres.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>Aluno</Th>
              <Th>Paciente</Th>
              <Th>Setor</Th>
              <Th>Número Portuário</Th>
              <Th>Data Solicitação</Th>
              <Th>Data Resposta</Th>
              <Th>Data Entrada</Th>
              <Th>Data Saída</Th>
              <Th>Observações</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {pareceres.map((parecer) => (
              <tr key={parecer.id}>
                <Td>{parecer.aluno_name}</Td>
                <Td>{parecer.paciente_name}</Td>
                <Td>{parecer.setor_name}</Td>
                <Td>{parecer.num_port}</Td>
                <Td>{formatDate(parecer.solicitation_date)}</Td>
                <Td>{formatDate(parecer.answer_date)}</Td>
                <Td>{formatDate(parecer.enter_date)}</Td>
                <Td>{formatDate(parecer.leave_date)}</Td>
                <TdObs onClick={() => openObsModal(parecer.obs || "")}>
                  {parecer.obs}
                </TdObs>{" "}
                <Td style={{ textAlign: "right" }}>
                  <Button onClick={() => handleEditParecer(parecer.id)}>
                    Editar
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>Nenhum parecer encontrado.</p>
      )}

      {/* Observation Modal */}
      <AnimatePresence>
        {isObsModalOpen && (
          <ModalOverlay
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeObsModal}
          >
            <ModalContent
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <ModalTitle>Observações</ModalTitle>
              <p>{obsModalText || "Nenhuma observação"}</p>
              <Button onClick={closeObsModal}>Fechar</Button>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Create Parecer Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <ModalOverlay
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleCreateModalClose}
          >
            <ModalContent
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <ModalTitle>Novo Parecer</ModalTitle>
              <form onSubmit={handleFormSubmit}>
                <FormGroup>
                  <label htmlFor="aluno_id">Aluno:</label>
                  <select
                    id="aluno_id"
                    name="aluno_id"
                    value={newParecerData.aluno_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione um aluno</option>
                    {alunos.map((aluno) => (
                      <option key={aluno.id} value={aluno.id}>
                        {aluno.name}
                      </option>
                    ))}
                  </select>
                </FormGroup>
                <FormGroup>
                  <label htmlFor="paciente_id">Paciente:</label>
                  <select
                    id="paciente_id"
                    name="paciente_id"
                    value={newParecerData.paciente_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione um paciente</option>
                    {pacientes.map((paciente) => (
                      <option key={paciente.id} value={paciente.id}>
                        {paciente.name}
                      </option>
                    ))}
                  </select>
                </FormGroup>
                <FormGroup>
                  <label htmlFor="setor_id">Setor:</label>
                  <select
                    id="setor_id"
                    name="setor_id"
                    value={newParecerData.setor_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione um setor</option>
                    {setores.map((setor) => (
                      <option key={setor.id} value={setor.id}>
                        {setor.name}
                      </option>
                    ))}
                  </select>
                </FormGroup>
                <FormGroup>
                  <label htmlFor="num_port">Número Portuário:</label>
                  <input
                    type="number"
                    id="num_port"
                    name="num_port"
                    value={newParecerData.num_port}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="solicitation_date">
                    Data de Solicitação:
                  </label>
                  <input
                    type="date"
                    id="solicitation_date"
                    name="solicitation_date"
                    value={formatDateForInput(newParecerData.solicitation_date)}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="answer_date">Data de Resposta:</label>
                  <input
                    type="date"
                    id="answer_date"
                    name="answer_date"
                    value={formatDateForInput(newParecerData.answer_date)}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="enter_date">Data de Entrada:</label>
                  <input
                    type="date"
                    id="enter_date"
                    name="enter_date"
                    value={formatDateForInput(newParecerData.enter_date)}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="leave_date">Data de Saída:</label>
                  <input
                    type="date"
                    id="leave_date"
                    name="leave_date"
                    value={formatDateForInput(newParecerData.leave_date)}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="obs">Observações:</label>
                  <textarea
                    id="obs"
                    name="obs"
                    value={newParecerData.obs}
                    onChange={handleInputChange}
                  ></textarea>
                </FormGroup>
                <ModalActions>
                  <Button
                    type="button"
                    onClick={handleCreateModalClose}
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
};

export default PareceresPage;
