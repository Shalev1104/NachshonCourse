import { Modal, Spinner } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker'
import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch'
import { useLocation } from 'react-router-dom';
// import todo from '../../../server/model/todo';

const TodoPopup = (props : {show : boolean, onHide : () => void, title : string, id? : string, values? : {title : string, expirationDate : any, description : string, status : string}, methods : { addTodo? : (todo: any) => void, updateTodo? : (id : string, newTodo : any) => void } }) => {

  const url = useLocation().pathname;
  const [name, setName] = useState(props.values?.title || '');
  const [date, setDate] = useState(props.values?.expirationDate || '');
  const [description, setDescription] = useState(props.values?.description || '');
  const {fetchData, data, loading, error} = useFetch();


  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData
      .apply(this, [url, props.values? 'PUT' : 'POST', {title : name, expirationDate : (date as Date).toDateString(), description, status : props.values?.status || 'Active' }]);
  }

  useEffect(() => {
    if(data)
    {
      if(props.methods.addTodo)
        props.methods.addTodo(data);
      else if(props.methods.updateTodo)
        props.methods.updateTodo(props.id || '', (data as {update : any}).update)
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
          <input type="text" className = "form-control" value = {name} onChange = {(e) => setName(e.target.value)} required />
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
      <button className="btn btn-primary" id="submitTodo" type="submit" disabled={loading}>{loading? <Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
    /> : "Save changes" }</button>
    </Modal.Footer>
    </form>
  </Modal>
  );
};

export default TodoPopup;