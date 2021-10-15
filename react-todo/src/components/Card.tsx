import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Card( {expirationDate, title, description, color, status, id} : any) : JSX.Element {
  console.log(expirationDate, title, description, color, status, id);
  return (
        <div className = "card shadow rounded" key={id} style={{borderTop:"4px solid " + color, width : "270px", height : "200px"}}>
          <div className="card-header text-primary" style={{display : 'flex', justifyContent : 'space-between'}}>
            <div>{expirationDate}</div>
            <div>Active</div>
          </div>
          <div className="card-body p-3">
            <h4 className="card-title">{title}</h4>
            <p className="lead card-description" style={{fontSize:"17px"}}>{description}</p>
            <div className="card-functions">
              <a href="#" className="bi bi-pencil-square mr-3" style={{color}}></a>
              <a href="#" className="bi bi-trash" style={{color}}></a>
            </div>
          </div>
        </div>
  );
}


export default Card;