import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Home from './components/Home';
import { useLocation, Switch, Route, useHistory, Redirect } from 'react-router-dom'
import TodoPopup from './components/modals/TodoPopup';
import { useEffect, useState } from 'react';
import UpdateTodo from './components/UpdateTodo';
import DeletePopup from './components/modals/DeletePopup';
import todo from '../server/model/todo';

export default function App() : JSX.Element {
  const [todos, setTodos] = useState<null|todo[]>(null);

  const addTodo = (todo: todo) => {
    setTodos(todos && [todo, ...todos]);
  };

  const updateTodo = (id : string, newTodo : todo) => {
    setTodos(todos && todos.map(todo => (todo.id === id ? newTodo : todo)));
  };

  const removeTodo = (id : string) => {
    setTodos(todos && todos.filter(todo => todo.id !== id));
  };

  const isUserAuthenticated = false;
  const location = useLocation();
  const history = useHistory();
  type state = {
    background : Location,
    deleteModal : boolean,
    data : {
      title : string,
      description : string,
      expirationDate : Date,
      status : string
    },
    id : string
  }

  const background : any = typeof location.state === "object" ?
   location.state && (location.state as state).background : undefined;

  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
    history.replace('/todos')
  };

  useEffect(() => {
    setModal(background);
  },[background, location]);
  
  return (
    <>
        <Switch location={ background || location }>
          <Route exact path = "/" render ={() => {
            return isUserAuthenticated ? <Redirect to="/login"/> 
            : <Redirect to="/todos"/>;
          }}/>
          <Route exact path="/todos" children={ <Home todos={todos} setTodos={setTodos}/> } />
          <Route exact path="/login" component={Home} />
          <Route path={ `/todos/:id` } component={UpdateTodo}/>
        </Switch>
        { modal && (location.state as state).deleteModal && <DeletePopup show={modal} onHide={toggle} title="Confirm delete" id={ (location.state as state).id } methods={{removeTodo}} /> }
        { modal && !(location.state as state).deleteModal && <TodoPopup show={ modal } onHide={ toggle } {...(location.state as state).data ? { title : "Update Task", id : (location.state as state).id, values : (location.state as state).data, methods : {updateTodo} } : { title : "Create Task", methods : {addTodo}}}/> } 
    </>
  );
}