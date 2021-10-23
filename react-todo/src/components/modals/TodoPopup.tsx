import { Button, Modal } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker'
import { useState } from 'react';

const TodoPopup = (props : {show : boolean, onHide : () => void, title : string, values? : {title : string, expirationDate : any, description : string}}) => {

    const [name, setName] = useState(props.values?.title);
    const [date, setDate] = useState(props.values?.expirationDate);
    const [description, setDescription] = useState(props.values?.description);
    return (
        <Modal {...props} centered>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className = "form-group">
            <label>Task Name</label>
            <input type="text" className = "form-control" value = {name} onChange = {(e) => setName(e.target.value)}/>
        </div>
        <div className = "form-group">
            <label>Expired</label>
            <DatePicker selected={date} onChange={e => setDate(e)} className="form-control" minDate={new Date()}/>
        </div>
        <div className = "form-group">
            <label>Description</label>
            <textarea rows = {5} className = "form-control" value = {description} onChange = {(e) => setDescription(e.target.value)}></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Save changes</Button>
      </Modal.Footer>
    </Modal>
    );
};

export default TodoPopup;