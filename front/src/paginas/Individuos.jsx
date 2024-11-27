import "./componentes.css";
import axios from "axios";
import { useState, useEffect } from "react";

function Individuos() {
  //Entidades e listas utilizadas na página
  const [individuo, setIndividuo] = useState(null);
  const [individuos, setIndividuos] = useState([]);

  //Funções de carregamento de dados do backend
  function getIndividuos() {
    axios.get("http://localhost:5224/individuos").then((resposta) => {
      setIndividuos(resposta.data);
    });
  }

  useEffect(() => {
    getIndividuos();
  }, []);

  //Funções para manipulação da entidade principal
  function novoIndividuo() {
    setIndividuo({
      id: 0,
      codigo: "",
      nome: "",
    });
  }

  function editarIndividuo(individuo) {
    setIndividuo(individuo);
  }

  function alterarIndividuo(campo, valor, idx) {
    function alterarIndividuo(campo, valor, id) {
      setIndividuo((prevIndividuo) => ({
        ...prevIndividuo,
        [campo]: valor, // Atualiza o campo específico (nome ou código)
      }));
    }
  }

  function excluirIndividuo(id) {
    if (window.confirm("Tem certeza que deseja excluir este indivíduo?")) {
      axios
        .delete(`http://localhost:5224/individuos/${id}`)
        .then(() => {
          window.location.href = "http://localhost:5224/individuos";
        })
    }
  }

  function salvarIndividuo() {
    
    if (individuo.id === 0) {
      axios
        .post("http://localhost:5224/individuos", individuo)
        .then(() => { 
          window.location.href = "http://localhost:5224/individuos";
        })     
      } else {
        axios
        .put(`http://localhost:5224/individuos/${individuo.id}`, individuo)
        .then(() => {
          window.location.href = "http://localhost:5224/individuos";
        })
    }
  }
    
    function reiniciarEstadoDosObjetos() {
      setIndividuo(null);
      getIndividuos();
    }
    
    function aoDigitar(e){
      const { name, value } = e.target;
      setIndividuo({
        ...individuo,
        [name]: value
      });
    }

  //Função para geração do formulário
  function getFormulario() {
    return (
      <form>
        <label>Código</label>
        <input
          type="text"
          name="codigo"
          value={individuo.codigo}
          onChange={aoDigitar}
        />
        <label>Nome</label>
        <input
          type="text"
          name="nome"
          value={individuo.nome}
          onChange={aoDigitar}
        />

        <button
          type="button"
          onClick={() => {
            salvarIndividuo();
          }}
        >
          Salvar
        </button>
        <button
          type="button"
          onClick={() => {
            setIndividuo(null);
          }}
        >
          Cancelar
        </button>
      </form>
    );
  }

  //Funções para geração da tabela
  function getLinhaDaTabela(individuo) {
    return (
      <tr key={individuo.id}>
        <td>{individuo.id}</td>
        <td>{individuo.codigo}</td>
        <td>{individuo.nome}</td>
        <td>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  "Confirmar a exclusão do indivíduo " + individuo.nome + "?"
                )
              ) {
                excluirIndividuo(individuo.id);
              }
            }}
          >
            Excluir
          </button>
          <button
            type="button"
            onClick={() => {
              editarIndividuo(individuo);
            }}
          >
            Editar
          </button>
        </td>
      </tr>
    );
  }


  function getLinhasDaTabela() {
    const linhasDaTabela = [];
    for (let i = 0; i < individuos.length; i++) {
      const individuo = individuos[i];
      linhasDaTabela[i] = getLinhaDaTabela(individuo);
    }
    return linhasDaTabela;
  }

  function getTabela() {
    return (
      <table key="tabIndividuos">
        <tbody>
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
          {getLinhasDaTabela()}
        </tbody>
      </table>
    );
  }

  //Função do conteúdo principal
  function getConteudo() {
    if (individuo === null) {
      return (
        <>
          <button
            type="button"
            onClick={() => {
              novoIndividuo();
            }}
          >
            Novo indivíduo
          </button>
          {getTabela()}
        </>
      );
    } else {
      return getFormulario();
    }
  }

  return (
    <div className="cadastros">
      <div className="conteudo">{getConteudo()}</div>
    </div>
  );
}

export default Individuos;
