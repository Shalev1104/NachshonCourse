import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Card from './components/Card';

function App() : JSX.Element {
  const todos = [{expirationDate : '01/01/2000', title : 'adada', description : 'dasdasdasdsa', color : '#ff00ff', status : 'd', id : 1 }, {expirationDate : '02/02/2020', title : 'nvkxnvkx', description : 'dfodsjfojsdo', color : '#00ff00', status : 'f', id : 2}]
  return (
    <div>
    { todos.map(todo => <Card {...todo} />) }
    </div>
  );
}

export default App;
