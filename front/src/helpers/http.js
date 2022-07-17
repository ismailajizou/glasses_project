import { API_URL } from "@/CONSTANT";
import Axios from "axios";

export const csrf = () => http.get("/sanctum/csrf-cookie");

const http = Axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export default http;