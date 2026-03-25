// src/config/api.js

const apiBaseUrl = process.env.REACT_APP_API_URL;

if (!apiBaseUrl) {
  throw new Error(
    "REACT_APP_API_URL is not defined. Set it in your environment (.env or Docker)."
  );
}

export { apiBaseUrl };
