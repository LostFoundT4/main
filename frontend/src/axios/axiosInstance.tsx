import axios from "axios";

let baseURL = "http://findmyitem.app/"; // Towards API-hosted IP address

export default axios.create({
    baseURL : baseURL
})