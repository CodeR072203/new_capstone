import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // ✅ Allow cookies to be sent with requests
});

export default api;
