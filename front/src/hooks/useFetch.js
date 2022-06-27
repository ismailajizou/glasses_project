import http from "@/helpers/http";
import useSWR from "swr";

const fetcher = (url, config) => http.get(url, config).then(res => res.data);

export default function useFetch(url, config = {}){
    return useSWR(url, () => fetcher(url, config), );
}