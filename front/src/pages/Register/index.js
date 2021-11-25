import React, { useReducer } from "react";
import { useAuth } from "../../providers/auth";
import { Link, useHistory } from "react-router-dom";
import Input from "../../components/Input";

const initialState = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
};

const regexEmail =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const reducer = (state, action) => {
  switch (action.type) {
    case "name":
      return { ...state, name: action.value };
    case "email":
      return { ...state, email: action.value };
    case "password":
      return { ...state, password: action.value };
    case "password_confirmation":
      return { ...state, password_confirmation: action.value };
    default:
      throw new Error();
  }
};

export default function Register() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const auth = useAuth();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, email, password, password_confirmation } = state;
      if (name && email && password && password_confirmation) {
        if (password !== password_confirmation) {
          throw new Error("A senha e confirmação de senha devem ser iguais.");
        }

        if (name.length < 3) {
          throw new Error("O campo Nome deve conter mais de 3 caractéres.");
        }

        if (password.length < 6) {
          throw new Error("O campo Senha deve conter mais de 5 caractéres.");
        }

        if (!regexEmail.test(email)) {
          throw new Error("Campo Email inválido.");
        }

        const { success, message } = await auth.signup(name, email, password);
        if (success) {
          alert("Usuário cadastrado com sucesso!");
          history.push("/login");
        } else {
          throw new Error(message);
        }
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
    <div className="w-screen flex justify-center">
      <div className="bg-white h-auto shadow-md rounded-md mt-24 p-4 md:w-1/3 lg:w-1/3 xl:w-1/5 z-20">
        <p className="text-blue-600 font-bold text-5xl text-center">
          N<span className="font-thin">IoT</span>
        </p>
        <h1 className="mt-4 text-2xl text-blue-600 font-bold">
          Registrar na plataforma
        </h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <Input
            label="Nome"
            type="text"
            placeholder="Seu nome"
            name="name"
            id="name"
            value={state.name}
            onChange={(e) =>
              dispatch({ type: e.target.name, value: e.target.value })
            }
          />
          <Input
            placeholder="usuario@email.com"
            label="Email"
            type="email"
            name="email"
            id="email"
            value={state.email}
            onChange={(e) =>
              dispatch({ type: e.target.name, value: e.target.value })
            }
          />
          <Input
            placeholder="*********"
            label="Senha"
            type="password"
            name="password"
            id="password"
            value={state.password}
            onChange={(e) =>
              dispatch({ type: e.target.name, value: e.target.value })
            }
          />
          <Input
            placeholder="*********"
            label="Confirmação de senha"
            type="password"
            name="password_confirmation"
            id="password_confirmation"
            value={state.password_confirmation}
            onChange={(e) =>
              dispatch({ type: e.target.name, value: e.target.value })
            }
          />

          <Link
            className="text-center mt-4 opacity-70 hover:text-black hover:opacity-100 hover:underline"
            to="/login"
          >
            Já tem um usuário?
          </Link>

          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-700 shadow-lg mt-4"
            type="submit"
          >
            Registrar
          </button>
        </form>
      </div>
      <div className="bg-blue-600 absolute w-screen h-screen"></div>
    </div>
  );
}
