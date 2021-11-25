import React, { useReducer, useState, useEffect } from "react";
import Input from "../../../components/Input/index";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import api from "../../../providers/api";
import { useAuth } from "../../../providers/auth";

const initialState = {
  name: "",
  password: "",
  password_confirmation: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "name":
      return { ...state, name: action.value };
    case "password":
      return { ...state, password: action.value };
    case "password_confirmation":
      return { ...state, password_confirmation: action.value };
    case "clear":
      return { ...initialState };
    case "fill":
      return { ...action.value };
    default:
      throw new Error();
  }
};

export default function Configs({ isOpen, closeModal, reloadData }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [result, setResult] = useState(null);
  const auth = useAuth();

  const handleCloseModal = () => {
    if (isSuccess) {
      auth.signout();
    }
    setIsLoading(false);
    setIsSuccess(false);
    setResult(null);
    dispatch({ type: "clear" });
    closeModal();
  };

  useEffect(() => {
    dispatch({
      type: "fill",
      value: { name: auth.user.name },
    });
  }, []);

  const handleDelete = async () => {
    if (confirm("Deseja deletar a conta?")) {
      try {
        setIsLoading(true);
        const apiresponse = await api.delete(`/users`, {
          headers: { "x-access-token": auth.user.token },
        });
        const data = apiresponse.data;
        if (!apiresponse || !data.success) {
          setIsSuccess(false);
          throw new Error("Erro interno!");
        }
        reloadData();
        setIsSuccess(true);
        setResult(data);
        setIsLoading(false);
      } catch (err) {
        if (err.response?.data?.error) {
          alert(err.response.data.error);
        } else {
          alert(err.message);
        }
        setResult(null);
        setIsLoading(false);
        console.error(err.message);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const dto = {
        name: state.name,
      };

      if (state.password === state.password_confirmation) {
        dto.password = state.password;
      }

      setIsLoading(true);
      const apiresponse = await api.put(`/users`, dto, {
        headers: { "x-access-token": auth.user.token },
      });
      const data = apiresponse.data;
      if (!apiresponse || !data.success) {
        setIsSuccess(false);
        throw new Error("Erro interno!");
      }
      reloadData();
      setIsSuccess(true);
      setResult(data);
      setIsLoading(false);
    } catch (err) {
      if (err.response?.data?.error) {
        alert(err.response.data.error);
      } else {
        alert(err.message);
      }
      setResult(null);
      setIsLoading(false);
      console.error(err.message);
    }
  };

  return (
    isOpen && (
      <div className="w-screen h-screen absolute z-20 ">
        <div
          style={{ transform: "translateX(-50%)" }}
          className="bg-white rounded-2xl w-96 absolute z-30 mt-8 p-4 left-1/2 flex flex-col"
        >
          {isLoading && (
            <div className="flex flex-col items-center">
              <div>
                <AiOutlineLoading3Quarters className="animate-spin text-4xl m-4" />
              </div>
              <div>Carregando...</div>
            </div>
          )}
          {!isLoading && result !== null && (
            <div className="flex flex-col items-center">
              <div
                className={`text-6xl ${
                  isSuccess ? "text-green-500" : "text-red-500"
                }`}
              >
                {isSuccess ? <IoCheckmarkCircleSharp /> : <MdCancel />}
              </div>
              <div className="mb-4">
                {isSuccess
                  ? "Informações atualizadas com sucesso!"
                  : "Falha ao realizar atualização de usuário!"}
              </div>
              <button
                className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => handleCloseModal()}
              >
                Voltar ao Dashboard
              </button>
            </div>
          )}
          {!isLoading && result === null && (
            <>
              <div className="flex flex-row justify-between">
                <span className="text-blue-600 font-bold text-xl">
                  Editar configurações do perfil
                </span>
                <button
                  className="pr-2 font-bold"
                  onClick={() => handleCloseModal()}
                >
                  X
                </button>
              </div>
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
                label="Senha"
                type="password"
                placeholder="********"
                name="password"
                id="password"
                value={state.password}
                onChange={(e) =>
                  dispatch({ type: e.target.name, value: e.target.value })
                }
              />
              <Input
                label="Confirmação de senha"
                type="password"
                placeholder="********"
                name="password_confirmation"
                id="password_confirmation"
                value={state.password_confirmation}
                onChange={(e) =>
                  dispatch({ type: e.target.name, value: e.target.value })
                }
              />
              <div className="mt-4 flex flex-row justify-between">
                <button
                  className="px-4 py-2 shadow-lg cursor-pointer bg-red-500 rounded-xl hover:bg-red-400 text-white"
                  onClick={() => handleDelete()}
                >
                  Deletar conta
                </button>
                <button
                  className="px-4 py-2 shadow-lg text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  onClick={() => handleSubmit()}
                >
                  Alterar
                </button>
              </div>
            </>
          )}
        </div>
        <div
          className="bg-black opacity-25 w-full h-full"
          onClick={() => handleCloseModal()}
        ></div>
      </div>
    )
  );
}
