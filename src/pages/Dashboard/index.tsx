import React, { useState, FormEvent, useEffect } from "react";

import { Title, Form, Repositories, Error } from "./styles";

import api from "../../services/api";

import logo from "../../assets/logo.svg";

import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard = () => {

  const [inputError, setInputError] = useState<string>("");
  const [newRepo, setNewRepo] = useState<string>("");
  const [repositories, setRepositories] = useState<Repository[]>(() => {
      const storagedRepos = localStorage.getItem('@git:repositories')
     
       if(storagedRepos) {
        return JSON.parse(storagedRepos)
      }else {
        return [];
      }
  });


  useEffect(() => {
    localStorage.setItem('@git:repositories', JSON.stringify(repositories))

  }, [repositories])

  const handleAdd = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!newRepo) {
      setInputError("digite o nome/repo corretamente");
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repo = response.data;

      setRepositories([...repositories, repo]);
      setNewRepo("");
      setInputError("");
    } catch (err) {
      setInputError("erro na busca do repo");
    }
  };

  return (
    <>
      <img src={logo} alt="git" />
      <Title>Explore Repositórios no Github</Title>
      <Form hassError={!!inputError} onSubmit={handleAdd}>
        <input
          type="text"
          value={newRepo}
          placeholder="Digite o nome do repositorio"
          onChange={(e) => setNewRepo(e.target.value)}
        />
        <button>pesquise</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Repositories>
        {repositories.map((repo) => (
          <Link to={`repository/${repo.full_name}`} key={repo.full_name}>
            <img src={repo.owner.avatar_url} alt={repo.full_name} />
            <div>
              <strong>{repo.full_name}</strong>
              <p>{repo.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
