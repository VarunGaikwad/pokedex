import axios from "axios";
import { base_url } from "../data/common";

const api = axios.create({
    baseURL: base_url,
})

interface AxiosRequestOptions {
    method?: string;
    headers?: Record<string, string>;
    params?: Record<string, string>;
    data?: string;
}

export function axiosRequest(url: string, options: AxiosRequestOptions = {
    method: "GET"
}) {
    return api(url, options)
        .then(response => response.data)
        .catch(error => Promise.reject(error?.response?.data?.message ?? "Error"))
}