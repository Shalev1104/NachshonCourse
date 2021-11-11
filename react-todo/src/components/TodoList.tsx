import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Card from './Card';
import useFetch from '../hooks/useFetch';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import todo from '../../server/model/todo';

function generateColor()
{
  const generate = () => { return Math.floor(Math.random() * 256); }
  return { red : generate(), green : generate(), blue : generate() } 
}
export default function TodoList({ todos, setTodos } : {todos : todo[]|null, setTodos : React.Dispatch<React.SetStateAction<todo[] | null>>}) : JSX.Element {

  const {fetchData, data, loading, error} = useFetch();
  const url = useLocation().pathname;

  useEffect(() => {
    fetchData(url, 'GET');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(data)
    {
      setTodos(data);
    }
  }, [data, setTodos]);

  return (
    <div className = 'card-container d-flex flex-wrap justify-content-center'>
    { loading ? <div>Loading...</div> :
      error ? <div className='alert alert-danger p-2 text-center d-block' role="alert">{error}</div>  :
      todos && todos.length > 0 ? todos.map(todo => <Card {...todo} color={generateColor()} key={todo.id} />) : <p>No Tasks available</p>}
    </div>
  );
}