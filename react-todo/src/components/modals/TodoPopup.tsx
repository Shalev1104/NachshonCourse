import { Modal } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker'
import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch'
import { useLocation } from 'react-router-dom';
import todo from '../../../server/model/todo';
import ButtonSpinner from '../ButtonSpinner';

const TodoPopup = (props : {show : boolean, onHide : () => void, title : string, id? : string, values? : {title : string, expirationDate : any, description : string, status : string}, methods : { addTodo? : (task: todo) => void, updateTodo? : (id : string, newTodo : todo) => void } }) : JSX.Element => {

  const url = useLocation().pathname;
  const [name, setName] = useState(props.values?.title || '');
  const [date, setDate] = useState(props.values?.expirationDate || '');
  const [description, setDescription] = useState(props.values?.description || '');
  const [status, setStatus] = useState(props.values?.status || "Active");
  const {fetchData, data, loading, error} = useFetch();
  
  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      fetchData.apply(this,[url, props.values? 'PUT' : 'POST', {title : name, expirationDate : (date as Date).toDateString(), description, status}]);
  }

  useEffect(() => {
    if(data)
    {
      if(props.methods.addTodo)
        props.methods.addTodo(data);
      else if(props.methods.updateTodo)
      // @ts-ignore
        props.methods.updateTodo(props.id, data.update)
      props.onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
      <Modal {...props} centered>
    <Modal.Header closeButton>
      <Modal.Title>{props.title}</Modal.Title>
    </Modal.Header>
    <form onSubmit={ (e) => handleSubmit(e)}>
    <Modal.Body>
      {error && <div className='alert alert-danger p-2 text-center d-block' role="alert">{error}</div>}
      <div className = "form-group">
          <label>Task Name</label>
          <div className="input-group">
            <input type="text" className = "form-control form-buffer" value = {name} onChange = {(e) => setName(e.target.value)} required />
            <select className="form-select-sm" value={status} onChange={(e) => setStatus(e.target.value)} required>
              <option value="Active">Active</option>
              <option value="Irrelevant">Irrelevant</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
      </div>
      <div className = "form-group">
          <label>Expired</label>
          <DatePicker selected={date} onChange={e => setDate(e)} className="form-control" minDate={new Date()} required />
      </div>
      <div className = "form-group">
          <label>Description</label>
          <textarea rows = {5} className = "form-control" value = {description} onChange = {(e) => setDescription(e.target.value)}></textarea>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <button className="btn btn-primary" id="submitTodo" type="submit" disabled={loading}>{loading? <ButtonSpinner/> : "Save changes" }</button>
    </Modal.Footer>
    </form>
  </Modal>
  );
};

export default TodoPopup;