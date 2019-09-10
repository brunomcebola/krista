import axios from 'axios';

//criação da ligação a base de dados
const api = axios.create({ baseURL: 'https://kristaapi.herokuapp.com/'});

export default api;