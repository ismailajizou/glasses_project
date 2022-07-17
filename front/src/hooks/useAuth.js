import useSWR from 'swr'
import http from '@/helpers/http'
import { useEffect } from 'react'
import {csrf} from '@/helpers/http';
import { useNavigate } from "react-router-dom" 

export const useAuth = ({ middleware, redirectIfAuthenticated, redirectIfError = "/login" }) => {
    const to = useNavigate()
    
    const { data: user, error, mutate } = useSWR('/api/user', async () =>{
        try {
            const { data } = await http.get('/api/user');
            return data;
        } catch(err){
            if (err.response.status !== 409) throw err;
            to('/verify-email');
        }
    })
    const login = async ({ setErrors, setStatus, values }) => {
        await csrf()
        setErrors({})
        setStatus?.(null)
        try {
            await http.post('/login', values);
            mutate();
        } catch (err) {
            if (err.response.status !== 422) throw error
            setErrors(err.response.data.errors)
        }
    }

    const logout = async () => {
        if (! error) {
            try{
                await csrf()
                await http.post('/logout');
                mutate();
            } catch(err) {} 
        }
        window.location.pathname = redirectIfError;
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user) to(redirectIfAuthenticated);
        if (middleware === 'auth' && error) logout();
    }, [user, error])

    return {
        user,
        login,
        logout,
    }
}