import { useState } from "react";

const useFetch = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async (url : string, method : string, {...body} = {} ) => {
        setLoading(true);
        try
        {
            const res = await fetch(url, {
                method,
                ...Object.keys({...body}).length > 0 && {body : JSON.stringify({...body})},
                headers : {'Content-Type': 'application/json'}
            });
            setData(await res.json());
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