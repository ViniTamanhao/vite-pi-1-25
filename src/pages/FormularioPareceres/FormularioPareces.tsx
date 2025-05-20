import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../../utils/api";
import { format } from "date-fns";

interface Paciente {
  id: number;
  name: string;
}

interface Setor {
  id: number;
  name: string;
}

const Container = styled.div`
  padding: 2rem;
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FormCard = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
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

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin-top: 0.5rem;
  text-align: center;
`;

const InfoMessage = styled.p`
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
  font-style: italic;
`;

const CreateParecerAlunoPage = () => {
  const [alunoIdInput, setAlunoIdInput] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAlunoName, setCurrentAlunoName] = useState<string>("");
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [setores, setSetores] = useState<Setor[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [parecerData, setParecerData] = useState({
    aluno_id: 0, // This will be set after authentication
    paciente_id: "",
    setor_id: "",
    num_port: "",
    solicitation_date: format(new Date(), "yyyy-MM-dd"), // Default to today
    answer_date: "",
    enter_date: "",
    leave_date: "",
    obs: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch dropdown data (pacientes and setores)
    const fetchDropdownData = async () => {
      try {
        const [pacientesRes, setoresRes] = await Promise.all([
          api.get("/pacientes"),
          api.get("/setores"),
        ]);
        setPacientes(pacientesRes.data.data);
        setSetores(setoresRes.data.data);
      } catch (error) {
        console.error("Erro ao buscar dados para dropdowns:", error);
        setFormError("Erro ao carregar opções de pacientes ou setores.");
      }
    };

    fetchDropdownData();
  }, []);

  const handleAlunoIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);
    try {
      const id = parseInt(alunoIdInput);
      if (isNaN(id)) {
        setFormError("ID do aluno inválido. Por favor, digite um número.");
        return;
      }
      const response = await api.get(`/alunos/${id}`);
      if (response.data && response.data.data) {
        setParecerData((prev) => ({ ...prev, aluno_id: id }));
        setCurrentAlunoName(response.data.data.name);
        setIsAuthenticated(true);
      } else {
        setFormError("Aluno não encontrado. Verifique o ID e tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao verificar ID do aluno:", error);
      setFormError(
        "Erro ao verificar ID do aluno. Tente novamente mais tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setParecerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitParecer = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);

    try {
      const payload = {
        aluno_id: parecerData.aluno_id,
        paciente_id: Number(parecerData.paciente_id),
        setor_id: Number(parecerData.setor_id),
        num_port: Number(parecerData.num_port),
        solicitation_date: parecerData.solicitation_date,
        answer_date: parecerData.answer_date || null,
        enter_date: parecerData.enter_date || null,
        leave_date: parecerData.leave_date || null,
        obs: parecerData.obs || null,
      };

      await api.post("/pareceres", payload);
      alert("Parecer criado com sucesso!");
      navigate("/"); // Redirect to home or a success page
    } catch (error) {
      console.error("Erro ao criar parecer:", error);
      setFormError(
        "Erro ao criar parecer. Verifique os dados e tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <FormCard>
        <Title>Criar Novo Parecer</Title>
        {!isAuthenticated ? (
          <form onSubmit={handleAlunoIdSubmit}>
            <InfoMessage>
              Por favor, insira seu ID de aluno para prosseguir.
            </InfoMessage>
            <FormGroup>
              <label htmlFor="alunoId">ID do Aluno:</label>
              <input
                type="text"
                id="alunoId"
                value={alunoIdInput}
                onChange={(e) => setAlunoIdInput(e.target.value)}
                required
                disabled={isLoading}
              />
            </FormGroup>
            {formError && <ErrorMessage>{formError}</ErrorMessage>}
            <ButtonGroup>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Verificando..." : "Confirmar ID"}
              </Button>
            </ButtonGroup>
          </form>
        ) : (
          <form onSubmit={handleSubmitParecer}>
            <InfoMessage>
              Criando parecer para **{currentAlunoName}** (ID:{" "}
              {parecerData.aluno_id})
            </InfoMessage>
            <FormGroup>
              <label htmlFor="paciente_id">Paciente:</label>
              <select
                id="paciente_id"
                name="paciente_id"
                value={parecerData.paciente_id}
                onChange={handleFormChange}
                required
                disabled={isLoading}
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
                value={parecerData.setor_id}
                onChange={handleFormChange}
                required
                disabled={isLoading}
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
                value={parecerData.num_port}
                onChange={handleFormChange}
                required
                disabled={isLoading}
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="solicitation_date">Data de Solicitação:</label>
              <input
                type="date"
                id="solicitation_date"
                name="solicitation_date"
                value={parecerData.solicitation_date}
                onChange={handleFormChange}
                required
                disabled={isLoading}
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="answer_date">Data de Resposta:</label>
              <input
                type="date"
                id="answer_date"
                name="answer_date"
                value={parecerData.answer_date}
                onChange={handleFormChange}
                disabled={isLoading}
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="enter_date">Data de Entrada:</label>
              <input
                type="date"
                id="enter_date"
                name="enter_date"
                value={parecerData.enter_date}
                onChange={handleFormChange}
                disabled={isLoading}
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="leave_date">Data de Saída:</label>
              <input
                type="date"
                id="leave_date"
                name="leave_date"
                value={parecerData.leave_date}
                onChange={handleFormChange}
                disabled={isLoading}
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="obs">Observações:</label>
              <textarea
                id="obs"
                name="obs"
                value={parecerData.obs}
                onChange={handleFormChange}
                disabled={isLoading}
              ></textarea>
            </FormGroup>
            {formError && <ErrorMessage>{formError}</ErrorMessage>}
            <ButtonGroup>
              <Button
                type="button"
                onClick={() => navigate("/")}
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Criar Parecer"}
              </Button>
            </ButtonGroup>
          </form>
        )}
      </FormCard>
    </Container>
  );
};

export default CreateParecerAlunoPage;
