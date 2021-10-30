import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker'
import { useEffect, useState } from 'react';
import { useLocation } from "react-router";
import useFetch from "../hooks/useFetch";
import todo from '../../server/model/todo';

const UpdateTodo = () => {
    const url = useLocation().pathname;
    const {fetchData, data : todo, loading, error} = useFetch();

    useEffect(() => {
        fetchData(url, 'GET');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(todo)
        {
            setName((todo as todo).title);
            setDate(new Date((todo as todo).expirationDate));
            setDescription((todo as todo).description || '');
        }
    }, [todo]);

    const [name, setName] = useState('');
    const [date, setDate] : any = useState('');
    const [description, setDescription] = useState('');
    return (
        <div className="position-absolute top-50 start-50 translate-middle">
            { loading && <div>loading...</div> }
            { error && <div className='alert alert-danger p-2 text-center d-block' role="alert">{error}</div> }
            { todo &&
            <><h1>Update Task</h1><div className="form-group">
                    <label>Task Name</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                </div><div className="form-group">
                        <label>Expired</label>
                        <DatePicker selected={date} onChange={e => setDate(e)} className="form-control" minDate={new Date()} />
                    </div><div className="form-group">
                        <label>Description</label>
                        <textarea rows={5} className="form-control" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div><button className="btn btn-primary position-absolute end-0 mt-2">Save changes</button></>
            }
        </div>
    );
};

export default UpdateTodo;