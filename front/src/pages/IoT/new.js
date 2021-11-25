import React, { useReducer } from "react";
import api from "../../providers/api";
import { useAuth } from "../../providers/auth";

const initialValues = {
  name: "",
  description: "",
  category: "temperature",
  trigger: "",
  actionRoute: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "name":
      return { ...state, name: action.value };
    case "description":
      return { ...state, description: action.value };
    case "category":
      return { ...state, category: action.value };
    case "trigger":
      return { ...state, trigger: action.value };
    case "actionRoute":
      return { ...state, actionRoute: action.value };
    default:
      throw new Error();
  }
};

export default function New() {
  const [state, dispatch] = useReducer(reducer, initialValues);
  const auth = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const { name, description, category, trigger, actionRoute } = state;
      if (name && description && category && trigger && actionRoute) {
        //TODO: regras de negócio sobre os campos

        const { data } = api.post(
          "/iot",
          {
            name,
            description,
            category,
            trigger,
            actionRoute,
          },
          { headers: { "x-access-token": auth.user.token } }
        );
      } else {
        throw new Error("Todos os campos devem ser preenchidos corretamente.");
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.message ||
          "Erro interno ao tentar criar usuário, tente novamente mais tarde."
      );
    }
  };

  return (
    <div>
      <h1>Criar novo IoT</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nome</label>
        <input
          type="text"
          name="name"
          id="name"
          value={state.name}
          onChange={(e) =>
            dispatch({ type: e.target.name, value: e.target.value })
          }
        />
        <br />
        <label htmlFor="description">Descrição</label>
        <input
          type="text"
          name="description"
          id="description"
          value={state.description}
          onChange={(e) =>
            dispatch({ type: e.target.name, value: e.target.value })
          }
        />
        <br />
        <label htmlFor="category">Categoria</label>
        <select
          name="category"
          id="category"
          value={state.category}
          onChange={(e) =>
            dispatch({ type: e.target.name, value: e.target.value })
          }
        >
          <option value="temperature">Temperatura</option>
          <option value="moisture">Umidade</option>
          <option value="voltage">Tensão</option>
          <option value="current">Corrente</option>
          <option value="availability">Disponibilidade</option>
        </select>
        <br />
        <label htmlFor="trigger">Gatilho</label>
        <input
          type="text"
          name="trigger"
          id="trigger"
          value={state.trigger}
          onChange={(e) =>
            dispatch({ type: e.target.name, value: e.target.value })
          }
        />
        <br />
        <label htmlFor="actionRoute">Rota de ação</label>
        <input
          type="text"
          name="actionRoute"
          id="actionRoute"
          value={state.actionRoute}
          onChange={(e) =>
            dispatch({ type: e.target.name, value: e.target.value })
          }
        />
        <br />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
