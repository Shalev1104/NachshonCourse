import '../App.css';
import Header from './Header';
import TodoList from './TodoList';

export default function Home() : JSX.Element {
  return (
    <>
        <Header/>
        <TodoList/>
    </>
  );
}