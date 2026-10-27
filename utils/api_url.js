// URL de la API central. Se puede cambiar con un archivo .env.local (ver .env.example).
// Va sin "/" al final, porque los servicios agregan la barra.
export const APIURL = import.meta.env.VITE_API_URL ?? "http://localhost:8080"
