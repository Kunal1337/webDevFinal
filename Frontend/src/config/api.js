// src/config/api.js

const isLocalhost = window.location.hostname === "localhost";

// Backend API URLs
export const API_BASE_URL = isLocalhost 
  ? "http://localhost:3001"
  : "https://webdevfinal-2.onrender.com";


export default API_BASE_URL;