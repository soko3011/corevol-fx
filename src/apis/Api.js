import axios from 'axios'

const Api = axios.create({
  baseURL: 'https://localhost:5001/api/'
  // baseURL: "https://fxvolengine.azurewebsites.net/api"
})

export default Api
