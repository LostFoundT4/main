import axios from "axios";

let baseURL = "http://147.182.247.167"; // Towards API-hosted IP address

export default axios.create({
    baseURL : baseURL
})