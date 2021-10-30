import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useLocation } from 'react-router-dom';

export default function Header() : JSX.Element {
  const location = useLocation();
  return (
      <div className="text-center">
        <h1>Todo App</h1>
        <br/>
        <Link to={{pathname : location.pathname, state : { background : location, deleteModal : false } }} className="btn btn-primary">
          Create
        </Link>
        <hr/>
      </div>
  );
}