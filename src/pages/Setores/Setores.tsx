import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";

interface Setor {
  id: number;
  name: string;
}

// Interface for new setor form data
interface NewSetorData {
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

  input {
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

const SetoresPage = () => {
  const [setores, setSetores] = useState<Setor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSetorData, setNewSetorData] = useState<NewSetorData>({ name: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [editingSetor, setEditingSetor] = useState<Setor | null>(null); // New state for editing
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
    setEditingSetor(null); // Clear any editing state
    setNewSetorData({ name: "" }); // Reset form
    setIsModalOpen(true);
  };

  const handleEditSetor = (setor: Setor) => {
    setEditingSetor(setor); // Set the setor to be edited
    setNewSetorData({ name: setor.name }); // Populate form with existing data
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSetorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingSetor) {
        // If editing an existing setor
        await api.put(`/setores/${editingSetor.id}`, newSetorData);
      } else {
        // If creating a new setor
        await api.post("/setores", newSetorData);
      }
      await fetchSetores(); // Reload data after successful creation/update
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Erro ao salvar setor:", error);
      alert("Erro ao salvar setor. Verifique os dados e tente novamente.");
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
                  <Button onClick={() => handleEditSetor(setor)}>Editar</Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>Nenhum setor encontrado.</p>
      )}

      {/* Create/Edit Setor Modal */}
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
              <ModalTitle>
                {editingSetor ? "Editar Setor" : "Novo Setor"}
              </ModalTitle>
              <form onSubmit={handleFormSubmit}>
                <FormGroup>
                  <label htmlFor="name">Nome:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newSetorData.name}
                    onChange={handleInputChange}
                    required
                  />
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
                    {isLoading
                      ? "Salvando..."
                      : editingSetor
                      ? "Atualizar"
                      : "Confirmar"}
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

export default SetoresPage;
