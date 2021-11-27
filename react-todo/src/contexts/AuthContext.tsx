import { createContext, useContext, useEffect, useState } from 'react';
import { FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebaseJS'


const methods = {
    login :  (email : string, password : string) => auth.signInWithEmailAndPassword(email, password),
    register :  (email : string, password : string) =>  auth.createUserWithEmailAndPassword(email, password),
    google :  (token : string) => auth.signInWithCredential(GoogleAuthProvider.credential(token)),
    facebook :  (token : string) =>  auth.signInWithCredential(FacebookAuthProvider.credential(token)),
    github :  (token : string) => auth.signInWithCredential(GithubAuthProvider.credential(token)),
    logout : () => auth.signOut()
}


const AuthContext = createContext({
    user : null as firebase.default.User | null,
    methods
});


export const useAuth = () => useContext(AuthContext);

const AuthProvider : React.FC = ({children}) => {
    const [user, setUser] = useState<firebase.default.User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            setUser(user);
            setLoading(false);
        });
    }, []);

    return <AuthContext.Provider value={{user, methods}}>{!loading && children }</AuthContext.Provider>;
}
export default AuthProvider;