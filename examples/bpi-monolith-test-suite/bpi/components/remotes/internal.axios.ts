import Axios from "axios";

const server = "http://localhost:9000";

export const internalAxios = Axios.create({
    baseURL: server,
});