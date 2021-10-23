import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Card from './Card';

export default function TodoList() : JSX.Element {
  const todos = [{id : 1, title : 'wash the dishes', description : 'kdjsadkjask', color : {red : 0, green : 255, blue : 0}, status : 'Active', expirationDate : new Date(2002, 4, 11)}, {id : 2, title : 'wash the dishes', description : 'kdjsadkjask', color : {red : 0, green : 255, blue : 0}, status : 'Active', expirationDate : new Date(2002, 4, 11)}, {id : 3, title : 'wash the dishes', description : 'kdjsadkjask', color : {red : 0, green : 255, blue : 0}, status : 'Completed', expirationDate : new Date(2002, 4, 11)}, {id : 4, title : 'wash the dishes', description : 'kdjsadkjask', color : {red : 0, green : 255, blue : 0}, status : 'Irrelevant', expirationDate : new Date(2002, 4, 11)}, {id : 5, title : 'wash the dishes', description : 'kdjsadkjask', color : {red : 0, green : 255, blue : 0}, status : 'Overdue', expirationDate : new Date(2002, 4, 11)},{id : 6, title : 'wash the dishes', description : 'kdjsadkjask', color : {red : 0, green : 255, blue : 0}, status : 'Active', expirationDate : new Date(2002, 4, 11)}, {id : 8, title : 'wash the dishes', description : 'kdjsadkjask', color : {red : 0, green : 255, blue : 0}, status : 'Active', expirationDate : new Date(2002, 4, 11)}, {id : 7, title : 'wash the dishes', description : 'kdjsadkjask', color : {red : 0, green : 255, blue : 0}, status : 'Active', expirationDate : new Date(2002, 4, 11)}, {id : 9, title : 'wash the dishes', description : 'kdjsadkjask', color : {red : 0, green : 255, blue : 0}, status : 'Active', expirationDate : new Date(2002, 4, 11)}];
  return (
    <div className = 'card-container d-flex flex-wrap justify-content-center'>
    { todos.map(todo => <Card {...todo} key={todo.id} />) }
    </div>
  );
}