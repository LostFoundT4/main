import axios from "axios";

let baseURL = "https://www.findmyitem.app"; // Towards API-hosted IP address

export default axios.create({
    baseURL : baseURL
})