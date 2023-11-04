import axios from "axios";

let baseURL = "http://127.0.0.1:8080"; // Towards API-hosted IP address

export default axios.create({
    baseURL : baseURL,
    headers: {
        'Authorization': 'Token ' + localStorage.getItem('authToken'),
    }
})