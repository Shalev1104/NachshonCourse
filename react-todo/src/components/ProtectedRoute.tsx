import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const ProtectedRoute = (props : RouteProps) : JSX.Element => {
    const { user } = useAuth();
    if(user)
        return <Route {...props} />
    return <Redirect to='/auth'/>
}

export default ProtectedRoute;