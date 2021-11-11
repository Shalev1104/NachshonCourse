import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useRef, useState } from 'react';
import useFetch from '../hooks/useFetch';
import SocialButton from "./SocialButton";
import { useLocation } from 'react-router';
import { auth } from '../config/firebaseConfig';


export default function Authenticate() : JSX.Element {
    const url = useLocation().pathname;
    const { fetchData, data, error, loading } = useFetch();

    const email = useRef() as React.MutableRefObject<HTMLInputElement>;
    const password = useRef() as React.MutableRefObject<HTMLInputElement>;
    const googleAppId = process.env.GOOGLE_APP_ID || '832999638457-n8depgjtt44nb4fo31piorppi59nfs32.apps.googleusercontent.com';
    const facebookAppId = process.env.FACEBOOK_APP_ID || '4855221371174808';
    const githubAppId = process.env.GITHUB_APP_ID || 'ff9ef47f40d21b6a0779';
    const [show, setShow] = useState(false);

    const handleAuth = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const path = (e.nativeEvent as any).submitter.name === 'login' ?
        `${url}/login/email` : `${url}/register`;
        fetchData(path, 'POST', {
            email : email.current.value,
            password : password.current.value
        });
    }
    
    const sendTokenToServer = (response : any) => {
        const token = response.token.idToken || response.token.accessToken;
        fetchData(`${url}/login/${response.provider}`, 'POST', { token });
    }

    useEffect(() => {
        auth.onAuthStateChanged(user => console.log(user));
    })
    
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
            <div className="p-5 border border-2 border-success"> 
                <h1 className="fw-light fs-2 text-center">Authenticate</h1>
                <br/>
                <form onSubmit={e => handleAuth(e)}>
                    <div className="form-group">
                        <label>Email</label>
                        <div className="input-group">
                            <span className="input-group-text bi bi-person-circle"></span>
                            <input type="email" ref={email} className="form-control" placeholder="boomer@bommer.com" required/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-group">
                            <span className="input-group-text bi bi-key-fill"/>
                            <input type={show ? "text" : "password"} className="form-control" ref={password} placeholder="enter your password" required/>
                            <button type="button" className={`input-group-text text-decoration-none bi bi-${show ? 'eye-fill' : 'eye-slash-fill' }`} onClick={() => setShow(!show)}/>
                        </div>
                    </div>
                    <br/>
                    { error && <p className={`alert alert-danger p-1 text-center`} role="alert">{error}</p> }
                    <div className="d-flex justify-content-between">
                        <button type="submit" name="register" className="btn btn-primary" disabled={loading}>Register</button>
                        <button type="submit" name="login" className="btn btn-primary" disabled={loading}>Login</button>
                    </div>
                    <hr/>
                    <SocialButton
                        provider={'facebook'}
                        onLoginSuccess={sendTokenToServer}
                        appId={facebookAppId}
                        className="btn btn-primary btn-floating mb-1 w-100">
                            <i className="bi-facebook ps-3" aria-disabled={loading}>&emsp;Login with Facebook</i>
                    </SocialButton>
                    <br />
                    <SocialButton
                        provider={'google'}
                        onLoginSuccess={sendTokenToServer}
                        appId={googleAppId}
                        className="btn btn-danger btn-floating mb-1 w-100">
                            <i className="bi-google" aria-disabled={loading}>&emsp;Login with Google</i>
                    </SocialButton>
                    <br/>
                    <SocialButton
                        provider={'github'}
                        onLoginSuccess={sendTokenToServer}
                        appId={githubAppId}
                        className="btn btn-dark btn-floating mb-1 w-100">
                            <i className="bi-github" aria-disabled={loading}>&emsp;Login with Github</i>
                    </SocialButton>
                </form>
            </div>
        </div>
  );
}
