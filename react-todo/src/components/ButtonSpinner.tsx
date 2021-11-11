import { Spinner } from "react-bootstrap";

const ButtonSpinner = () : JSX.Element => {
    return (
        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
    )
}
export default ButtonSpinner;