import axios from 'axios';

// Crea una instancia de Axios con la configuración por defecto
const instance = axios.create({
  baseURL: 'http://localhost:3000', // Reemplaza esto con la URL base de tu API
});

// Antes de que se haga una solicitud, inserta el token en los encabezados de la misma
instance.interceptors.request.use(function (config) {
  //obtener el token del localstorage
  const token = localStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`;

  return config;
}, function (error) {
  // En caso de que haya un error, lo rechaza para que pueda ser manejado por la llamada
  return Promise.reject(error);
});

//export default instance;
export default instance;
