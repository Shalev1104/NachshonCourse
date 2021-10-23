import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker'
import { useState } from 'react';
import { useParams } from "react-router";

const UpdateTodo = () => {
    const { id } = useParams<{ id: string }>();
    const [name, setName] = useState('');
    const [date, setDate] : any = useState('');
    const [description, setDescription] = useState('');
    return (
        <div className="position-absolute top-50 start-50 translate-middle">
            <h1>Update Task</h1>
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
            <button className="btn btn-primary position-absolute end-0 mt-2">Save changes</button>
        </div>
    );
};

export default UpdateTodo;