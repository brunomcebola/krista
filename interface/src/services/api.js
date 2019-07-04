import axios from 'axios';

const api = axios.create({ baseURL: 'https://kristaapi.herokuapp.com/kristaApi/'});

export default api;