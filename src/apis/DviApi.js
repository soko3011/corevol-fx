import Api from './Api'

export default {
  getInitialize () {
    return Api.get('Initialize')
  },
  getDviData (body) {
    return Api.post('DviReturn', body)
  },
  changeDviCcyPair (body) {
    return Api.post('ChangeDviCcyPair', body)
  },
  UpdateMultsAndSpreads (body) {
    return Api.post('UpdateMultsAndSpreads', body)
  },
  DelRangeFromList (body) {
    return Api.post('DelRangeFromList', body)
  },
  MatchSurfaceToIpvInputs (body) {
    return Api.post('MatchSurfaceToIpvInputs', body)
  },
  GetListOfActiveDvis () {
    return Api.get('GetListOfActiveDvis')
  },
  RemoveDviFromUse (body) {
    return Api.post('RemoveDviFromUse', body)
  },
  GetDashBoardSurfs () {
    return Api.get('GetDashBoardSurfs')
  },
  GetIpvSurfaces () {
    return Api.get('GetIpvSurfaces')
  },
  GetSingleDashBoardSurf (body) {
    return Api.post('GetSingleDashBoardSurf', body)
  },
  CheckSessionDviCount () {
    return Api.get('CheckSessionDviCount')
  }
}
