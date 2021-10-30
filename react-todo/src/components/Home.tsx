import todo from '../../server/model/todo';
import Header from './Header';
import TodoList from './TodoList';

export default function Home({ todos, setTodos} : {todos : todo[]|null, setTodos : React.Dispatch<React.SetStateAction<todo[] | null>>}) : JSX.Element {
  return (
    <>
        <Header/>
        <TodoList todos={todos} setTodos={setTodos}/>
    </>
  );
}