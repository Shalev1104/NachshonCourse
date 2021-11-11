import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const useFetch = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useAuth();

    const fetchData = async (url : string, method : string, {...body} = {} ) => {
        setLoading(true);
        try
        {
            const res = await fetch(url, {
                method,
                ...Object.keys({...body}).length > 0 && {body : JSON.stringify({...body})},
                headers : {'Content-Type': 'application/json', ...user && {'Authorization' : `Bearer ${await user.getIdToken()}`}}
            });
            const data = await res.json();
            if(!res.ok)
                throw new Error(data);
            setData(data);
        }
        catch(err)
        {
            setError((err as Error).message);
        }
        finally {
            setLoading(false);
        }
    }
    return { fetchData, data, loading, error}
}
export default useFetch;