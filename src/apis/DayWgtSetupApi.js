import Api from './Api'

export default {
  GetAvailableCurr () {
    return Api.get('GetAvailableCurr')
  },
  GetEvents (body) {
    return Api.post('GetEvents', body)
  },
  GetSelectedEventList (body) {
    return Api.post('GetSelectedEventList', body)
  },
  SaveDataToDB (body) {
    return Api.post('SaveDataToDB', body)
  }

}
