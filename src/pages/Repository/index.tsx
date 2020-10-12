import React , {useEffect , useState} from 'react'

import {Link, useRouteMatch} from 'react-router-dom'
import { FiChevronLeft, FiChevronRight} from 'react-icons/fi'
import { Header, RepositoryInfo, Issues } from './styles'

import api from '../../services/api'

import logo from "../../assets/logo.svg";


interface RepoParams {
    repository : string;
}
interface Repository {
  full_name: string;
  description: string;
  start : number;
  open_issues_count : number;
  forks : number;
  stargazers_count : number;
  owner: {
    login: string;
    avatar_url: string;
  };
}
interface Issue {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  }
}

const Repository = () => {
    
    const { params } = useRouteMatch<RepoParams>()  

    const [single , setSingle] = useState<Repository | null >(null);
    const [issue , setIssue] = useState<Issue[]>([]);

    useEffect(() => {
  
    async function loadData() : Promise<void> {

     const [repository, issues] =  await Promise.all([
          api.get(`repos/${params.repository}`),
          api.get(`repos/${params.repository}/issues`)
     ]);
    setSingle(repository.data)
    setIssue(issues.data)
    }  
    loadData();
    }, [params.repository])

    console.log(single)
    return (
       <> 
      <Header>
          <img src={logo} alt="Git expo" />
          <Link to="/">
            <FiChevronLeft size={16} />
              Voltar
          </Link>
      </Header> 
      {single && (
         <RepositoryInfo>
        <header>
           <img src={single.owner.avatar_url} alt={single.owner.login} />
           <div>
                <strong>
                    {single.full_name}
                </strong>
                 <p>{single.description}</p>   
            </div>     
        </header>
          <ul>
            <li>
           <strong>{single.stargazers_count}</strong>
                <span>Stars</span>
            </li>
             <li>
                <strong>{single.forks}</strong>
                <span>Forks</span>
            </li>
             <li>
                <strong>{single.open_issues_count}</strong>
                <span>Issues Abertas</span>
            </li>          
          </ul>  
      </RepositoryInfo>
      )}
        {issue.length > 0 ? issue.map(item => (
          <Issues key={item.id}>
              <a href={item.html_url}>
              <div>
                <strong>{item.title}</strong>
                <p>{item.user.login}</p>
              </div>
              <FiChevronRight size={20} />
            </a>
          </Issues> 
        )) : <p>Não há issues para essa esse repo</p> }
      </>
    )
}

export default Repository