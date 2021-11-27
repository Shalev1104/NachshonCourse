import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useRef, useState } from 'react';
import SocialButton from "./SocialButton";
import { useAuth } from '../contexts/AuthContext';
import { AuthError } from 'firebase/auth';
import { useLocation } from 'react-router';
import useFetch from '../hooks/useFetch';


export default function Authenticate() : JSX.Element {

    const { methods, user } = useAuth();
    const query = useLocation().search;
    const email = useRef() as React.MutableRefObject<HTMLInputElement>;
    const password = useRef() as React.MutableRefObject<HTMLInputElement>;
    const googleAppId = process.env.GOOGLE_APP_ID || '832999638457-n8depgjtt44nb4fo31piorppi59nfs32.apps.googleusercontent.com';
    const facebookAppId = process.env.FACEBOOK_APP_ID || '4855221371174808';
    const githubAppId = process.env.GITHUB_APP_ID || 'ff9ef47f40d21b6a0779';
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { data : githubResponse, error : githubErr ,fetchData : fetchAuth } = useFetch();

    const handleError = (err : AuthError) => setError(err.code);

    const handleAuth = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setLoading(true);
        const path = (event.nativeEvent as any).submitter.name as 'login' | 'register';
        
        methods[path](email.current.value, password.current.value)
            .catch((err : AuthError) => {
                handleError(err);})
            .finally(() => setLoading(false));
    }

    const handleSocialAuth = (response : any) => {
        setError('');
        setLoading(true);
        const token = response.access_token || response.token.idToken || response.token.accessToken;
        const providerType = response.provider as 'google' | 'facebook' | 'github';
        methods[providerType](token)
            .catch((err : AuthError) => {
                handleError(err);})
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        if(user)
            window.location.replace('/');
    }, [user]);

    useEffect(() => {
        const searchParams = new URLSearchParams(query); // no useQuery unfortunately
        if(searchParams.has('code'))
        {
            const code = searchParams.get('code');
            fetchAuth(`http://localhost:4000/authenticate/${code}`,'GET');
        }
    }, [query]);

    useEffect(() => {
        if(githubResponse && githubResponse['access_token'])
            handleSocialAuth({ provider : 'github', ...githubResponse as Object });
    }, [githubResponse]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
            <div className="p-5 border border-2 border-success"> 
                <h1 className="fw-light fs-2 text-center">Authenticate</h1>
                <br/>
                <form onSubmit={(e) => handleAuth(e)}>
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
                    { (error || githubErr) && <p className={`alert alert-danger p-1 text-center`} role="alert">{error || githubErr}</p> }
                    <div className="d-flex justify-content-between">
                        <button type="submit" name="register" className="btn btn-primary" disabled={loading}>Register</button>
                        <button type="submit" name="login" className="btn btn-primary"disabled={loading}>Login</button>
                    </div>
                    <hr/>
                    <SocialButton
                        provider={'facebook'}
                        onLoginSuccess={handleSocialAuth}
                        disabled={loading}
                        appId={facebookAppId}
                        className="btn btn-primary btn-floating mb-1 w-100">
                            <i className="bi-facebook ps-3">&emsp;Login with Facebook</i>
                    </SocialButton>
                    <br />
                    <SocialButton
                        provider={'google'}
                        onLoginSuccess={handleSocialAuth}
                        disabled={loading}
                        appId={googleAppId}
                        className="btn btn-danger btn-floating mb-1 w-100">
                            <i className="bi-google">&emsp;Login with Google</i>
                    </SocialButton>
                    <br/>
                    <SocialButton
                        provider={'github'}
                        disabled={loading}
                        appId={githubAppId}
                        redirect='http://localhost:3000/auth'
                        gatekeeper='http://localhost:9999'
                        className="btn btn-dark btn-floating mb-1 w-100">
                            <i className="bi-github">&emsp;Login with Github</i>
                    </SocialButton>
                </form>
            </div>
        </div>
  );
}
