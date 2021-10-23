import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import todo from '../../model/todo';
import { Link, useLocation } from 'react-router-dom';

export default function Card( {id, title, description, color, status, expirationDate} : todo) : JSX.Element {
  const rgbCol = `rgb(${color.red},${color.green},${color.blue})`;

  return (
        <div className = "card shadow rounded m-2" style={{borderTop:`4px solid ${rgbCol}`}}>
          <div className="card-header text-primary d-flex justify-content-between">
            <div>{expirationDate.toDateString()}</div>
            <div>Active</div>
          </div>
          <div className="card-body p-3 position-relative">
            <h4 className="card-title">{title}</h4>
            <p className="lead card-description" style={{fontSize:"1rem"}}>{description}</p>
            <div className="card-functions position-absolute bottom-0 end-0">
              <Link to={{pathname : `/todos/${id}`, state : { background : useLocation(), title, description, expirationDate } }} className="bi bi-pencil-square mx-3" style={{color : rgbCol}}/>
              <Link to="#" className="bi bi-trash" style={{color : rgbCol}}/>
            </div>
          </div>
        </div>
  );
}