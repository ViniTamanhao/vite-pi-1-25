import { useState } from "react";
import styled from "styled-components";
import api from "../../utils/api";

const Container = styled.div`
  max-width: 600px;
  margin: 5rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #444;
  }

  input,
  select {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #0077ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #005bb5;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
  color: green;
`;

export default function PublicAlunoForm() {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await api.post("/alunos", {
        name,
        coordenacao_id: Number(2),
      });
      console.log(response);

      setMessage(
        `Aluno de id ${response.data.data.id} cadastrado com sucesso! Guarde esse id para o registro de pareceres no futuro!`
      );
      setName("");
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
      setMessage("Erro ao cadastrar. Verifique os dados e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Title>Cadastro de Aluno</Title>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label htmlFor="name">Nome do Aluno</label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormGroup>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </Button>
        {message && <Message>{message}</Message>}
      </form>
    </Container>
  );
}
