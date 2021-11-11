import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebaseConfig'

const AuthContext = createContext({
    user : null as firebase.default.User|null
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider : React.FC = ({children}) => {
    const [user, setUser] = useState<firebase.default.User | null>(null);

    useEffect(() => {
        // console.log(user);
        // auth.onAuthStateChanged(setUser);
        // console.log(user);
    }, []);

    return <AuthContext.Provider value={{user}}>{ children }</AuthContext.Provider>;
}
export default AuthProvider;