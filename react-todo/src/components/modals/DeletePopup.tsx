import { Modal } from 'react-bootstrap';
import { useEffect } from 'react';
import useFetch from '../../hooks/useFetch';
import { useLocation } from 'react-router';
import ButtonSpinner from '../ButtonSpinner';


const DeletePopup = (props : {show : boolean, onHide : () => void, title : string, id : string, methods : { removeTodo : (id : string) => void}}) : JSX.Element => {
    const url = useLocation().pathname;
    const { fetchData, data, loading, error } = useFetch();

    const handleDelete = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchData(`${url}/${props.id}`, 'DELETE');
    }

    useEffect(() => {
        if(data)
        {
            props.methods.removeTodo(props.id);
            props.onHide();
        }
    }, [data])

    return (
        <Modal {...props} centered>
        <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <form onSubmit={ (e) => handleDelete(e)}>
        <Modal.Body>
        {error && <div className='alert alert-danger p-2 text-center d-block' role="alert">{error}</div>}
        <p>
            Are you sure you want to delete?
        </p>
        </Modal.Body>
        <Modal.Footer>
        <button className="btn btn-primary" id="deleteTodo" type="submit" disabled={loading}>{loading? <ButtonSpinner/> : "Delete" }</button>
        </Modal.Footer>
        </form>
    </Modal>
    );
};

export default DeletePopup;