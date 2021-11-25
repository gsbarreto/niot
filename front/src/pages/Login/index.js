import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useAuth } from "../../providers/auth";
import Input from "../../components/Input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { success, message } = await auth.signin(email, password);
      if (success) {
        history.push("/dashboard");
      } else {
        throw new Error(message);
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
    <div className="flex justify-center">
      <div className="bg-white h-auto z-10  shadow-md rounded-md mt-24 p-4 md:w-1/3 lg:w-1/3 xl:w-1/5">
        <p className="text-blue-600 font-bold text-5xl text-center">
          N<span className="font-thin">IoT</span>
        </p>
        <h1 className="mt-4 text-2xl text-blue-600 font-bold">Login</h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <Input
            type="text"
            label="Email"
            name="email"
            placeholder="usuario@email.com"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Senha"
            type="password"
            name="password"
            placeholder="*********"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Link
            className="text-center mt-6 opacity-70 hover:text-black hover:opacity-100 hover:underline"
            to="/register"
          >
            Não tem um usuário? Crie um agora!
          </Link>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-700 shadow-lg mt-4"
          >
            Entrar
          </button>
        </form>
      </div>
      <div className="bg-blue-600 absolute w-screen h-screen"></div>
    </div>
  );
}
