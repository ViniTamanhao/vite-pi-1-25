/**
 * Pacientes.tsx
 *
 * Displays a list of patients, allows creation and editing via modal form.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../../utils/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

// ------------------
// Types and Interfaces
// ------------------

interface Paciente {
  id: number;
  name: string;
  birth: string;
  sex: string;
  address: string;
}

interface NewPacienteData {
  name: string;
  birth: string;
  sex: string;
  address: string;
}

// ------------------
// Styled Components
// ------------------

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

// ------------------
// Component
// ------------------

export default function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPacienteData, setNewPacienteData] = useState<NewPacienteData>({
    name: "",
    birth: "",
    sex: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  // New state to hold the patient being edited
  const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null);
  const navigate = useNavigate();

  // Fetch patient list from API
  const fetchPacientes = async () => {
    try {
      const response = await api.get("/pacientes");
      setPacientes(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  // Open creation modal
  const handleCreatePaciente = () => {
    setEditingPaciente(null); // Ensure we are in creation mode
    setNewPacienteData({ name: "", birth: "", sex: "", address: "" });
    setIsModalOpen(true);
  };

  // Open edit modal and populate form with existing data
  const handleEditPaciente = (paciente: Paciente) => {
    setEditingPaciente(paciente);
    // Format the birth date to 'YYYY-MM-DD' for the input type="date"
    const formattedBirth = paciente.birth ? format(new Date(paciente.birth), "yyyy-MM-dd") : "";
    setNewPacienteData({
      name: paciente.name,
      birth: formattedBirth,
      sex: paciente.sex,
      address: paciente.address,
    });
    setIsModalOpen(true);
  };


  // Close modal
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewPacienteData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit new patient form or update existing patient
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...newPacienteData,
        birth: newPacienteData.birth ? format(new Date(newPacienteData.birth), "yyyy-MM-dd") : "",
      };

      if (editingPaciente) {
        await api.put(`/pacientes/${editingPaciente.id}`, payload);
      } else {
        await api.post("/pacientes", payload);
      }

      await fetchPacientes();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar paciente:", error);
      alert("Erro ao salvar paciente. Verifique os dados e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Format date to readable string
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy", { locale: ptBR }); // Changed to dd/MM/yyyy for display
    } catch (error) {
      console.error("Erro ao formatar a data:", error);
      return "Data inválida";
    }
  };

  // Animation variants for modal
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } },
  };

  // ------------------
  // Render
  // ------------------

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
                  <Button onClick={() => handleEditPaciente(paciente)}>
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

      {/* Create/Edit Patient Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <ModalOverlay
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleModalClose}
          >
            <ModalContent
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <ModalTitle>{editingPaciente ? "Editar Paciente" : "Novo Paciente"}</ModalTitle>
              <form onSubmit={handleFormSubmit}>
                <FormGroup>
                  <label htmlFor="name">Nome:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newPacienteData.name}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="birth">Data de Nascimento:</label>
                  <input
                    type="date"
                    id="birth"
                    name="birth"
                    value={newPacienteData.birth}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="sex">Sexo:</label>
                  <select
                    id="sex"
                    name="sex"
                    value={newPacienteData.sex}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <label htmlFor="address">Endereço:</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={newPacienteData.address}
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
                      : editingPaciente
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
}