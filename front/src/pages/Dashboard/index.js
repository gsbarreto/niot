import React, { useEffect, useState } from "react";
import { useAuth } from "../../providers/auth";
import api from "../../providers/api";
import { FaTemperatureHigh, FaCheckCircle } from "react-icons/fa";
import { IoWater, IoReload } from "react-icons/io5";
import { BsFillLightningFill } from "react-icons/bs";
import { GiElectricalResistance, GiCancel } from "react-icons/gi";
import { IoMdSwitch } from "react-icons/io";
import { VscDebugDisconnect } from "react-icons/vsc";
import { BiEditAlt, BiTrash, BiExit } from "react-icons/bi";
import { GrConfigure } from "react-icons/gr";
import Chart from "react-apexcharts";
import ModalEdit from "./Modals/edit";
import ModalNew from "./Modals/new";
import ModalConfigs from "./Modals/configs";

const convertCategories = (category) => {
  switch (category) {
    case "moisture":
      return "Umidade";
    case "temperature":
      return "Temperatura";
    case "current":
      return "Corrente";
    case "voltage":
      return "Tensão";
    case "availability":
      return "Disponibilidade";
    default:
      return "";
  }
};

export default function Dashboard() {
  const auth = useAuth();
  const [isLg, setIsLg] = useState(window.innerHeight < 768);
  const [iots, setIots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalNew, setOpenModalNew] = useState(false);
  const [openModalConfigs, setOpenModalConfigs] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.get("/iot", {
        headers: { "x-access-token": auth.user.token },
      });
      await setIots(data.data);
    };
    fetchData();
  }, []);

  useEffect(async () => {
    const transformData = async () => {
      if (selected && selected.data) {
        const parsed = selected.data.map((item, key) => {
          return { name: item.date, valor: item.value };
        });
        await setSelectedData(parsed);
      }
    };
    transformData();
  }, [selected]);

  const reloadData = async () => {
    const { data } = await api.get("/iot", {
      headers: { "x-access-token": auth.user.token },
    });
    if (data.data.length > 0 && selected) {
      setSelected(
        data.data?.filter((item) => item._id === selected._id)[0] || null
      );
    } else {
      setSelected(null);
    }
    await setIots(data.data);
  };

  const onDeleteIot = async () => {
    try {
      const { data } = await api.delete(`/iot/${selected._id}`, {
        headers: { "x-access-token": auth.user.token },
      });
      if (data.err) {
        throw new Error(data.err.message);
      }
      alert(`IoT excluido com sucesso!`);
      await reloadData();
      setSelected(null);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex justify-center">
      <ModalEdit
        isOpen={openModalEdit}
        closeModal={() => setOpenModalEdit(false)}
        selected={selected}
        reloadData={() => reloadData()}
      />
      <ModalNew
        isOpen={openModalNew}
        closeModal={() => setOpenModalNew(false)}
        reloadData={() => reloadData()}
      />
      <ModalConfigs
        isOpen={openModalConfigs}
        closeModal={() => setOpenModalConfigs(false)}
        reloadData={() => reloadData()}
      />
      <div className="z-10 md:mx-3 lg:w-11/12 xl:w-7/12">
        {/* Logo & Navbar */}
        <div className="flex flex-row justify-between">
          <p className="text-white font-bold text-5xl text-center">
            N<span className="font-thin">IoT</span>
          </p>

          <div className="bg-white rounded-b-2xl flex justify-center px-8 flex-row items-center">
            {auth.user.name && (
              <span className="mr-8">Olá {auth.user.name}!</span>
            )}

            <button
              className="mr-8 flex flex-row items-center"
              onClick={() => setOpenModalConfigs(true)}
            >
              <GrConfigure className="mr-2" />
              Configurações
            </button>
            <button
              className="flex flex-row items-center"
              onClick={auth.signout}
            >
              <BiExit className="mr-2" />
              Sair
            </button>
          </div>
        </div>
        {/* Header */}
        <div className="flex justify-between flex-row items-center  mb-2 ml-2 mt-8 ">
          <div className="text-white text-2xl font-bold">Dashboard</div>
          <button
            className="px-4 py-2 bg-white rounded-2xl text-green-600 hover:text-green-500 hover:bg-green-100 hover:border-green-500 hover:underline font-bold"
            onClick={() => setOpenModalNew(true)}
          >
            + Criar IoT
          </button>
        </div>
        <div
          style={{ height: isLg ? "550px" : "750px" }}
          className="bg-white rounded-xl flex flex-row overflow-hidden shadow-lg"
        >
          {/* Menu lateral */}
          <div className="bg-white rounded-l-xl border-r-2 w-3/12 ">
            <div className="h-26 border-b px-4 p-1">
              <span className="text-blue-600 font-bold text-2xl">Iots</span>
              <p className="text-sm">
                Abaixo são descritos todos os Iots disponíveis para esse
                usuário.
              </p>
            </div>
            <div
              style={{ height: isLg ? "82%" : "90%" }}
              className=" overflow-y-scroll"
            >
              {iots.length > 0 ? (
                iots.map((item, key) => {
                  return (
                    <div
                      className={`h-20 border-b p-2 w-full flex flex-row cursor-pointer items-center ${
                        selected && selected._id === item._id
                          ? "bg-gray-200"
                          : ""
                      }`}
                      key={key + "menu"}
                      onClick={() => setSelected(item)}
                    >
                      <div
                        style={{ aspectRatio: "1/1" }}
                        className={`w-1/5 rounded-full mr-2 bg-blue-600 flex items-center justify-center p-3.5 text-white text-xl`}
                      >
                        {item.category === "temperature" && (
                          <FaTemperatureHigh />
                        )}
                        {item.category === "moisture" && <IoWater />}
                        {item.category === "voltage" && <BsFillLightningFill />}
                        {item.category === "current" && (
                          <GiElectricalResistance />
                        )}
                        {item.category === "availability" && <IoMdSwitch />}
                      </div>
                      <div className="w-3/4 flex flex-col text-sm">
                        <span>{item.name}</span>
                        <span className="text-gray-700 text-xs">
                          Categoria: {convertCategories(item.category)}
                        </span>
                        <span className="text-gray-700 text-xs">
                          ID: {item._id}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-2 flex flex-col items-center">
                  <p>Nenhum IoT cadastrado!</p>
                  <p>Tente cadastrar clicando em </p>
                  <p>"Criar um dispositivo IoT"</p>
                </div>
              )}
            </div>
          </div>
          {/* Conteúdo */}
          <div className="w-full">
            {selected && (
              <div className="p-8 flex flex-col h-full justify-between">
                {/* Header conteúdo */}
                <div className="flex flex-row justify-between items-center">
                  <div>
                    <div className="flex flex-col">
                      <span className="text-blue-600 font-bold text-4xl">
                        {selected.name}
                      </span>
                      <span>
                        Ultima alteração:{" "}
                        {new Date(selected.updatedAt).toLocaleString("pt-br")}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row items-center">
                    <div
                      className="flex flex-col items-center mr-4 p-1 cursor-pointer"
                      onClick={() => setOpenModalEdit(true)}
                    >
                      <div className="text-3xl">
                        <BiEditAlt />
                      </div>
                      <p className="text-xs">Editar</p>
                    </div>
                    <div
                      className="flex flex-col items-center mr-4 cursor-pointer bg-red-500 rounded-xl py-1 px-3 hover:bg-red-400 text-white"
                      onClick={() => onDeleteIot()}
                    >
                      <div className="text-3xl hover:scale-110">
                        <BiTrash />
                      </div>
                      <p className="text-xs">Deletar</p>
                    </div>
                    <div
                      className="bg-blue-600 rounded-xl p-1 text-white flex flex-col items-center cursor-pointer hover:bg-blue-700"
                      onClick={() => reloadData()}
                    >
                      <div className="text-3xl">
                        <IoReload />
                      </div>
                      <p className="text-xs">Recarregar</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-center">
                  <div className="w-full">
                    <Chart
                      width={"100%"}
                      height={256}
                      options={{
                        chart: {
                          id: "basic-bar",
                        },
                        xaxis: {
                          categories: [
                            ...selected?.data?.map((item) =>
                              new Date(item.date).toLocaleString("pt-br")
                            ),
                          ],
                        },
                      }}
                      series={[
                        {
                          name: "series-1",
                          data: [...selected?.data?.map((item) => item.value)],
                        },
                      ]}
                    />
                  </div>
                </div>
                <div className="flex flex-row">
                  <div className="w-1/2 flex flex-col">
                    <span className="text-blue-600 font-bold text-lg">
                      Descrição
                    </span>
                    <p>{selected.description}</p>
                    <span className="text-blue-600 font-bold text-lg">
                      Categoria
                    </span>
                    <p>{convertCategories(selected.category)}</p>
                    <span className="text-blue-600 font-bold text-lg">
                      Chave secreta
                    </span>
                    <p>{selected.safeCode}</p>
                  </div>

                  <div className="w-1/2 flex flex-col">
                    {selected.trigger && (
                      <>
                        <span className="text-blue-600 font-bold text-lg">
                          Condional de ação
                        </span>
                        <p>Valor {selected.trigger}</p>
                      </>
                    )}
                    {selected.actionRoute && (
                      <>
                        <span className="text-blue-600 font-bold text-lg">
                          Url de ação
                        </span>
                        <p>{selected.actionRoute}</p>
                      </>
                    )}
                  </div>
                </div>
                {/* Tabela */}
                <div>
                  <div className="border-collapse w-full">
                    <div className="w-full flex flex-row text-center">
                      <div
                        className={`font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 w-1/${
                          selected.actionRoute ? "3" : "2"
                        }`}
                      >
                        Data de execução
                      </div>
                      <div
                        className={`font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 w-1/${
                          selected.actionRoute ? "3" : "2"
                        }`}
                      >
                        Valor
                      </div>
                      {selected.actionRoute && (
                        <div className="font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 w-1/3">
                          Ação executada?
                        </div>
                      )}
                    </div>
                    <div className="overflow-y-scroll h-24 w-full">
                      {selected.data.map((item, index) => {
                        return (
                          <div
                            className="bg-white lg:hover:bg-gray-100 flex flex-row lg:flex-row w-full"
                            key={"table" + index}
                          >
                            <div
                              className={`w-1/${
                                selected.actionRoute ? "3" : "2"
                              } text-gray-800 text-center border border-b`}
                            >
                              {new Date(item.date).toLocaleString("pt-br")}
                            </div>
                            <div
                              className={`w-1/${
                                selected.actionRoute ? "3" : "2"
                              } text-gray-800 text-center border border-b`}
                            >
                              {item.value}
                            </div>
                            {selected.actionRoute && (
                              <div className="w-1/3 text-gray-800 text-center border border-b">
                                {eval(`${item.value} ${selected.trigger}`) &&
                                selected.actionRoute ? (
                                  <div className="text-green-500 flex flex-row items-center justify-center h-full">
                                    <FaCheckCircle />
                                  </div>
                                ) : (
                                  <div className="text-red-500 flex flex-row items-center justify-center h-full">
                                    <GiCancel />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!selected && (
              <div className="text-gray-800 flex flex-col w-full h-full items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="text-7xl mb-4">
                    <VscDebugDisconnect />
                  </div>
                  <p>Não há nenhum IoT selecionado.</p>
                  <p>Selecione um no menu lateral esquerdo.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="absolute bg-blue-600 w-screen h-screen"></div>
    </div>
  );
}
