import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import TodoPopup from './modals/TodoPopup';
import { useState } from 'react';

export default function Header() : JSX.Element {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  return (
      <div className="text-center">
        <h1>Todo App</h1>
        <br/>
        <button className="btn btn-primary" onClick={toggle}>Create</button>
        <TodoPopup show={modal} onHide={toggle} title="Create Task"/><br/>
        <hr/>
      </div>
  );
}