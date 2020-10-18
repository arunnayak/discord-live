import axios from "axios";

const api = axios.create({
    baseURL: 'https://us-central1-discord-5c51a.cloudfunctions.net/api'
});

export default api;