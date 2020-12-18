import Api from './Api'

export default {
  GetAvailableCurr () {
    return Api.get('GetAvailableCurr')
  },
  GetEvents (body) {
    return Api.post('GetEvents', body)
  },
  BuildProductionList (body) {
    return Api.post('BuildProductionList', body)
  },
  SaveDataToDB (body) {
    return Api.post('SaveDataToDB', body)
  },
  refreshEventsFromApi () {
    return Api.get('RefreshEventsFromApi')
  },

}
