import Api from './Api'

export default {
  getCorrelationModel (body) {
    return Api.post('GetCorrelationModel', body)
  },
 

}
