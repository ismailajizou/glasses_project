import axios from "axios";

export const csrf = () => http.get("/sanctum/csrf-cookie");

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true
});

export default http;