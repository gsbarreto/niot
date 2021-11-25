import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import api from "../../providers/api";
import { useAuth } from "../../providers/auth";

export default function Details() {
  const { id } = useParams();
  const auth = useAuth();
  const [iot, setIot] = useState(null);
  const history = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.get(`/iot/${id}`, {
        "x-access-token": auth.user.token,
      });
      setIot(data.data);
    };
    fetchData();
  }, []);
  return (
    <div>
      {iot && (
        <ul>
          <li>Id: {iot._id}</li>
          <li>Nome: {iot.name}</li>
          <li>Description: {iot.description}</li>
          <li>Gatilho: {iot.trigger}</li>
          <li>Safe Code: {iot.safeCode}</li>
          <li>Categoria: {iot.category}</li>
          <li>Rota de ação: {iot.actionRoute}</li>
          <li>Criado em: {iot.createdAt}</li>
          <li>Atualizado em: {iot.updatedAt}</li>
        </ul>
      )}
      <button onClick={() => history.push("/dashboard")}>
        Voltar para Dashboard
      </button>
    </div>
  );
}
