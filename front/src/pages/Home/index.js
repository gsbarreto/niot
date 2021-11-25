import React from "react";
import { Link } from "react-router-dom";
import imgBg from "../../imgs/iot-bg.png";

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <div
        style={{ width: "1024px" }}
        className="absolute flex flex-col right-1/2 transform translate-x-1/2 px-6 mt-4"
      >
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-white font-bold text-5xl">
            N<span className="font-thin">IoT</span>
          </h1>
          <nav className="text-white w-3/12 flex justify-between items-center ">
            <Link className="hover:underline" to="/register">
              Cadastrar
            </Link>
            <span>|</span>
            <Link
              to="/login"
              className="bg-white py-1 text-blue-600 font-bold px-4 rounded-lg hover:bg-blue-100 shadow-lg"
            >
              Entrar
            </Link>
          </nav>
        </div>

        <div className="mt-28 text-white flex flex-row">
          <div className="w-1/2">
            <h2 className="text-6xl font-bold mb-5">
              Plataforma em nuvem para dispositivos IoT
            </h2>
            <p className="mb-2 text-lg">
              O objetivo desta plataforma é disponibilizar o armazenamento de
              dados de dispositivos IoT. Validação de dados e realização ações
              sobre os dados obtidos também são recursos disponíveis.
            </p>
            <p className="mb-2 text-lg">
              A estrutura desta plataforma está em nuvem, assim seus dados estão
              disponíveis 24 horas por dia.
            </p>
            <p className="mb-6 text-lg">
              E tudo de forma Open-Source. Não perca tempo e se cadastre!
            </p>
            <Link
              className="bg-white text-blue-600 py-2 px-4 rounded-lg font-bold hover:bg-blue-100 shadow-lg"
              to="/register"
            >
              Cadastrar
            </Link>
          </div>
          <div className="w-1/2">
            <img src={imgBg} alt="Imagem IoT" />
          </div>
        </div>
      </div>
      <div
        style={{ height: "95%" }}
        className="w-full bg-gradient-to-br from-blue-600 to-blue-700 rounded-br-full"
      ></div>
      <div className="text-blue-600 w-full mt-3 flex items-center justify-center">
        <p>Desenvolvido por Gabriel Barreto ©</p>
      </div>
    </div>
  );
}
