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

const TdObs = styled.td`
  max-width: 20px;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer; /* Add this */
`;

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

// Modal Styles
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
`;

const PareceresPage = () => {
  const [pareceres, setPareceres] = useState<Parecer[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPareceres = async () => {
      try {
        const response = await api.get("/pareceres");
        setPareceres(response.data.data);
      } catch (error) {
        console.error("Erro ao buscar pareceres:", error);
      }
    };

    fetchPareceres();
  }, []);

  const handleCreateParecer = () => {
    navigate("/pareceres/create");
  };

  const handleEditParecer = (id: number) => {
    navigate(`/pareceres/edit/${id}`);
  };

  const openModal = (text: string) => {
    setModalText(text);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalText("");
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
                <TdObs onClick={() => openModal(parecer.obs || "")}>
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

      <AnimatePresence>
        {modalOpen && (
          <ModalOverlay
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeModal} // Allow clicking outside to close
          >
            <ModalContent
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()} // Prevent click from closing modal content
            >
              <h2>Observações</h2>
              <p>{modalText || "Nenhuma observação"}</p>
              <Button onClick={closeModal}>Fechar</Button>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default PareceresPage;
