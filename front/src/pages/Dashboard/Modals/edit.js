import React, { useReducer, useEffect, useState } from "react";
import Input from "../../../components/Input/index";
import Select from "../../../components/Select/index";
import Checkbox from "../../../components/Checkbox/index";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import api from "../../../providers/api";
import { useAuth } from "../../../providers/auth";

const initialState = {
  name: "",
  description: "",
  actionRoute: "",
  category: "",
  triggerCondition: "",
  triggerValue: "",
  includeTrigger: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "name":
      return { ...state, name: action.value };
    case "description":
      return { ...state, description: action.value };
    case "actionRoute":
      return { ...state, actionRoute: action.value };
    case "category":
      return { ...state, category: action.value };
    case "triggerCondition":
      return { ...state, triggerCondition: action.value };
    case "triggerValue":
      return { ...state, triggerValue: action.value };
    case "includeTrigger":
      return { ...state, includeTrigger: action.value };
    case "clear":
      return { ...initialState };
    case "fill":
      const { value } = action;

      return {
        name: value.name,
        description: value.description,
        actionRoute: value.actionRoute,
        category: value.category,
        triggerCondition: value.trigger?.split(" ")[0] || "",
        triggerValue: value.trigger?.split(" ")[1] || "",
        includeTrigger: value.trigger ? true : false,
      };
    default:
      throw new Error();
  }
};

export default function ModalNew({ isOpen, closeModal, selected, reloadData }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [result, setResult] = useState(null);
  const auth = useAuth();

  useEffect(async () => {
    if (isOpen) {
      await dispatch({ type: "fill", value: selected });
    }
  }, [isOpen]);

  const handleCloseModal = () => {
    setIsLoading(false);
    setIsSuccess(false);
    setResult(null);
    dispatch({ type: "clear" });
    closeModal();
  };

  const handleSubmit = async () => {
    try {
      if (!state.name || !state.description) {
        alert("Os campos nome e descri????o devem ser preenchidos!");
        throw new Error("Os campos nome e descri????o devem ser preenchidos!");
      }

      if (state.includeTrigger) {
        if (
          !state.triggerCondition ||
          !state.triggerValue ||
          !state.actionRoute
        ) {
          alert(
            "Os campos Condicional do Gatilho, Valor do Gatilho e Rota de a????o devem ser preenchidos! \n Caso n??o deseje preencher, desative o campo 'Incluir Gatilho?'"
          );
          throw new Error(
            "Os campos Condicional do Gatilho, Valor do Gatilho e Rota de a????o devem ser preenchidos!"
          );
        }
      }

      const dto = {
        name: state.name,
        description: state.description,
        category: state.category,
        trigger: state.includeTrigger
          ? `${state.triggerCondition} ${state.triggerValue}`
          : "",
        actionRoute: state.includeTrigger ? state.actionRoute : "",
      };
      setIsLoading(true);
      const { data } = await api.put(`/iot/${selected._id}`, dto, {
        headers: { "x-access-token": auth.user.token },
      });

      if (!data.success) {
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
      setResult(false);
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
                  ? "IoT atualizado com sucesso!"
                  : "Falha ao realizar atualiza????o!"}
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
                  Editar dispositivo IoT
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
                label="Descri????o"
                type="text"
                placeholder="Descri????o do IoT"
                name="description"
                id="description"
                value={state.description}
                onChange={(e) =>
                  dispatch({ type: e.target.name, value: e.target.value })
                }
              />
              <Select
                label="Categoria"
                type="text"
                placeholder="Seu nome"
                name="category"
                id="category"
                options={[
                  { label: "Temperatura", value: "temperature" },
                  { label: "Umidade", value: "moisture" },
                  { label: "Tens??o", value: "voltage" },
                  { label: "Corrente", value: "current" },
                  { label: "Disponibilidade", value: "availability" },
                ]}
                value={state.category}
                onChange={(e) =>
                  dispatch({
                    type: e.target.name,
                    value: e.target.value,
                  })
                }
              />
              <div>
                <Checkbox
                  label="Incluir gatilho?"
                  name="includeTrigger"
                  id="includeTrigger"
                  defaultChecked={state.includeTrigger}
                  onChange={(e) =>
                    dispatch({
                      type: e.target.name,
                      value: !state.includeTrigger,
                    })
                  }
                />
              </div>
              <div className="flex flex-row w-full">
                <Select
                  label="Condicional do Gatilho"
                  type="text"
                  name="triggerCondition"
                  id="triggerCondition"
                  disabled={!state.includeTrigger}
                  options={[
                    { label: "", value: "" },
                    { label: "==", value: "==" },
                    { label: "!=", value: "!=" },
                    { label: ">", value: ">" },
                    { label: ">=", value: ">=" },
                    { label: "<", value: "<" },
                    { label: "<=", value: "<=" },
                  ]}
                  value={state.triggerCondition}
                  onChange={(e) =>
                    dispatch({
                      type: e.target.name,
                      value: e.target.value,
                    })
                  }
                />
                <div className="w-1/2">
                  <Input
                    label="Valor do Gatilho"
                    type="text"
                    placeholder="10"
                    name="triggerValue"
                    id="triggerValue"
                    disabled={!state.includeTrigger}
                    value={state.triggerValue}
                    onChange={(e) =>
                      dispatch({ type: e.target.name, value: e.target.value })
                    }
                  />
                </div>
              </div>

              <Input
                label="Rota de a????o"
                type="text"
                placeholder="https://www.meuiot.com.br/"
                name="actionRoute"
                id="actionRoute"
                disabled={!state.includeTrigger}
                value={state.actionRoute}
                onChange={(e) =>
                  dispatch({ type: e.target.name, value: e.target.value })
                }
              />
              <div className="mt-4 flex flex-row justify-between">
                <button className="px-4 py-2 shadow-lg text-blue-600 border rounded-lg hover:shadow-xl">
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 shadow-lg text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  onClick={() => handleSubmit()}
                >
                  Editar
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
