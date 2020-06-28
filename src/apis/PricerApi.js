import Api from './Api'

export default {
  setPricer (body) {
    return Api.post('SetPricer', body)
  },
  RemovePricerFromUse (body) {
    return Api.post('RemovePricerFromUse', body)
  },
  getLayouts () {
    return Api.get('GetPricerLayouts')
  },
  GetListOfActivePricers () {
    return Api.get('GetListOfActivePricers')
  },
  SaveLayout (body) {
    return Api.post('SavePricerLayout', body)
  },
  SetPricerLayout (body) {
    return Api.post('SetPricerLayout', body)
  },
  ReCalcOpt (body) {
    return Api.post('FxOpt', body)
  },
  CheckIfSurfaceExists (body) {
    return Api.post('CheckIfSurfaceExists', body)
  },
  ReturnCurrentOpts (body) {
    return Api.post('CurrentOpts', body)
  },
  GetSingleSpot (body) {
    return Api.post('GetSingleSpot', body)
  }
}
