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

    // const register = async ({ setErrors, values })=> {
    //     await csrf()
    //     setErrors({})
    //     try{
    //         await http.post('/register', values);
    //         mutate()
    //     } catch(err: any) {
    //         if (err.response.status !== 422) throw err
    //         setErrors(err.response.data.errors);
    //     }
    // }

    const login = async ({ setErrors, setStatus, values }) => {
        await csrf()
        setStatus?.(null)
        try {
            await http.post('/login', values);
            mutate();
        } catch (err) {
            if (err.response.status !== 422) throw error
            setErrors(err.response.data.errors)
        }
    }

    // const forgotPassword = async ({ setErrors, setStatus, values }) => {
    //     await csrf()
    //     setErrors({})
    //     setStatus(null)
    //     try {
    //         const {data} = await http.post('/forgot-password', values);
    //         setStatus(data.status)
    //     } catch (err) {
    //         if (err.response.status !== 422) throw err
    //         setErrors(err.response.data.errors)
    //     }
    // }

    // const resetPassword = async ({ setErrors, setStatus, values }) => {
    //     await csrf()
    //     setErrors({})
    //     setStatus(null)
    //     try {
    //         const { data } = await http.post('/reset-password', { token: router.query.token, ...values });
    //          router.push('/login?reset=' + Buffer.from(data.status, "binary").toString("base64"));
    //     } catch (err) {
    //         if (err.response.status != 422) throw err;
    //         setErrors(err.response.data.errors)   
    //     }
    // }

    // const resendEmailVerification = async ({ setStatus }) => {
    //     try {
    //         const { data } = await http.post('/email/verification-notification')
    //         setStatus(data.status);
    //     } catch (err) {
    //         console.error(err.response.data.errors);
    //     }
    // }

    const logout = async () => {
        if (! error) {
            try{
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
        // register,
        login,
        // forgotPassword,
        // resetPassword,
        // resendEmailVerification,
        logout,
    }
}