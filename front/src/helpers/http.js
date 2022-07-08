import Axios from "axios";

export const csrf = () => http.get("/sanctum/csrf-cookie");

const http = Axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export default http;