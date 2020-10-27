import PricerApi from "@/apis/PricerApi";
import store from "@/store/index.js";

export default class stratHelper {
  constructor(requestedStrat, optData) {
    this.requestedStrat = requestedStrat;
    this.optData = optData;
  }

  strats() {
    return new Array("rr25", "rr10", "str", "str25", "str10");
  }

  validateStrategyCreation() {
    return this.strats().includes(this.requestedStrat);
  }

  returnValidStrategy() {
    if (this.requestedStrat === "rr25") return this.createRR25();
    if (this.requestedStrat === "rr10") return this.createRR10();
    if (this.requestedStrat === "str") return this.createStraddle();
    if (this.requestedStrat === "str25") return this.createStrangle25();
    if (this.requestedStrat === "str10") return this.createStrangle10();
  }
  async getSmileObj() {
    try {
      let response = await PricerApi.getStrategyVol({
        cross: this.optData.cross,
        expiryText: this.optData.expiryText,
        UserName: store.state.currentUser
      });

      return JSON.parse(response.data.smileObj);
    } catch (error) {}
  }

  createRR25() {
    let leg1 = { ...this.optData };
    leg1.call_put = "PUT";
    leg1.strikeText = "25D";
    leg1.notional = "100";
    leg1.name = "1";

    let leg2 = { ...leg1 };
    leg2.call_put = "CALL";
    leg2.name = "2";
    leg2.notional = "-100";

    return new Array(leg1, leg2);
  }

  createRR10() {
    let leg1 = { ...this.optData };
    leg1.call_put = "PUT";
    leg1.strikeText = "10D";
    leg1.notional = "100";
    leg1.name = "1";

    let leg2 = { ...leg1 };
    leg2.call_put = "CALL";
    leg2.name = "2";
    leg2.notional = "-100";

    return new Array(leg1, leg2);
  }

  createStraddle() {
    let leg1 = { ...this.optData };
    leg1.call_put = "PUT";
    leg1.strikeText = "a";
    leg1.notional = "100";
    leg1.name = "1";

    let leg2 = { ...leg1 };
    leg2.call_put = "CALL";
    leg2.name = "2";
    leg2.notional = "100";

    return new Array(leg1, leg2);
  }

  async createStrangle25() {
    let vols = await this.getSmileObj();
    console.log(vols);

    let leg1 = { ...this.optData };
    leg1.call_put = "PUT";
    leg1.strikeText = "25D";
    leg1.notional = "100";
    leg1.name = "1";

    let leg2 = { ...leg1 };
    leg2.call_put = "CALL";
    leg2.name = "2";
    leg2.notional = "100";

    return new Array(leg1, leg2);
  }

  createStrangle10() {
    let leg1 = { ...this.optData };
    leg1.call_put = "PUT";
    leg1.strikeText = "10D";
    leg1.notional = "100";
    leg1.name = "1";

    let leg2 = { ...leg1 };
    leg2.call_put = "CALL";
    leg2.name = "2";
    leg2.notional = "100";

    return new Array(leg1, leg2);
  }
}
