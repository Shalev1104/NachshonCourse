import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() : JSX.Element {
  const location = useLocation();
  const { user, methods } = useAuth();

  const handleLogout = () => {
    methods.logout()
      .then(() => window.location.replace('/auth'))
      .catch(err => alert(err));
  }
  return (
      <>
        <div className="text-center">
        <h1>Todo App</h1>
        <br/>
        <Link to={{pathname : location.pathname, state : { background : location, deleteModal : false } }} className="btn btn-primary">
          Create
        </Link>
        </div>
        <div className="position-relative">
            <hr/>
            <div className="position-absolute end-0 bottom-0 d-flex align-items-end mx-1">
              <p className="mb-0">Logged in as {user?.email}</p>
              <button onClick={handleLogout} className="btn btn-primary ms-2 btn-sm">Logout</button>
            </div>
        </div>
      </>
  );
}