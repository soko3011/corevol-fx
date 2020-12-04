import PricerApi from "@/apis/PricerApi";
import store from "@/store/index.js";

export default class optCalcHelper {
  constructor(optsContainer, currentOpt, pricerKeys) {
    this.optsContainer = optsContainer;
    this.currentOpt = currentOpt;
    this.pricerKeys = pricerKeys;
  }
  baseConditionsIsValidated() {
    if (this.currentOpt.name === "-1") {
      return true;
    }

    const essentialKeys = [
      "cross",
      "spot",
      "expiryText",
      "strikeText",
      // "call_put",
      "userName"
    ];

    if (this.currentOpt === undefined) {
      return false;
    }

    for (const key of essentialKeys) {
      if (!this.currentOpt.hasOwnProperty(key)) {
        return false;
      }
    }

    return true;
  }
  async sendSingleOptionToServerForCalcs() {
    let calculatedAndOrderedArray = [];

    try {
      let response = await PricerApi.calculateSingleOption(this.currentOpt);
      let singleOpt = JSON.parse(response.data.result);

      const colID =
        parseInt(singleOpt.filter(x => x.Key === "id")[0].Value) + 1;

      calculatedAndOrderedArray.push({
        column: colID,
        results: [...this.orderedOptForGrid(singleOpt)]
      });

      return calculatedAndOrderedArray;
    } catch (err) {
      store.dispatch("setSnackbar", {
        text: `${err}  source:sendSingleOptionToServerForCalcs`,
        top: true
      });
    }
  }
  async sendContainerToServerForCalcs() {
    let calculatedAndOrderedArray = [];

    try {
      let response = await PricerApi.calculateContainer(this.optsContainer);
      let totals = JSON.parse(response.data.aggregate);
      let individuals = JSON.parse(response.data.components);

      calculatedAndOrderedArray.push({
        column: 0,
        results: [...this.orderedOptForGrid(totals)]
      });

      individuals.forEach(element => {
        const colID =
          parseInt(element.filter(x => x.Key === "id")[0].Value) + 1;

        calculatedAndOrderedArray.push({
          column: colID,
          results: [...this.orderedOptForGrid(element)]
        });
      });

      return calculatedAndOrderedArray;
    } catch (err) {
      store.dispatch("setSnackbar", {
        text: `${err}  source:sendContainerToServerForCalcs`,
        top: true
      });
    }
  }

  orderedOptForGrid(optArray) {
    let orderedArray = new Array();

    for (var cell of this.pricerKeys) {
      var index = optArray.findIndex(x => x.Key === cell);
      if (index > -1) {
        orderedArray.push(optArray[index].Value);
      }
    }
    return orderedArray;
  }
}
