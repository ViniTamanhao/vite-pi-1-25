/**
 * NovoPacientePublico.tsx
 *
 * Public-facing page allowing new patients to self-register.
 */

import { useState } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import api from "../../utils/api";

// ------------------
// Styled Components
// ------------------

const Container = styled.div`
  max-width: 500px;
  margin: 5rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #444;
    font-weight: 600;
  }

  input,
  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #0077ff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
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

const Message = styled.p<{ success?: boolean }>`
  color: ${({ success }) => (success ? "green" : "red")};
  font-weight: 600;
  margin-top: 1rem;
  text-align: center;
`;

// ------------------
// Component
// ------------------

export default function NovoPacientePublico() {
  const [formData, setFormData] = useState({
    name: "",
    birth: "",
    sex: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        birth: formData.birth
          ? format(new Date(formData.birth), "yyyy-MM-dd")
          : "",
      };

      await api.post("/pacientes", payload);
      setSuccess(true);
      setMessage("Cadastro realizado com sucesso!");
      setFormData({ name: "", birth: "", sex: "", address: "" });
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error);
      setMessage(
        "Ocorreu um erro. Por favor, verifique os dados e tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Title>Cadastro de Paciente</Title>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="birth">Data de Nascimento:</label>
          <input
            type="date"
            id="birth"
            name="birth"
            value={formData.birth}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="sex">Sexo:</label>
          <select
            id="sex"
            name="sex"
            value={formData.sex}
            onChange={handleChange}
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
            value={formData.address}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Cadastrar"}
        </Button>
        {message && <Message success={success}>{message}</Message>}
      </form>
    </Container>
  );
}
