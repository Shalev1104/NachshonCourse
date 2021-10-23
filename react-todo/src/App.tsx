import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Home from './components/Home';
import { useLocation, Switch, Route, useHistory } from 'react-router-dom'
import TodoPopup from './components/modals/TodoPopup';
import { useEffect, useState } from 'react';
import UpdateTodo from './components/UpdateTodo';

export default function App() : JSX.Element {
  const location = useLocation();
  const history = useHistory();
  type state = {
    background : Location,
    title : string,
    description : string,
    expirationDate : Date
  }
  let background : any;

  
  if(typeof location.state === "object")
    background = location.state && (location.state as state).background;

  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
    history.goBack();
  };

  useEffect(() => {
    setModal(background);
  },[location, background]);
  
  return (
    <>
        <Switch location={ background || location }>
          <Route exact path = "/" component= { Home }/>
          <Route path={ `/todos/:id` } component={UpdateTodo}/>
        </Switch>
        { modal && <TodoPopup show={ modal } onHide={ toggle } title="Update Task" values= {{...location.state as state}}/>} 
    </>
  );
}