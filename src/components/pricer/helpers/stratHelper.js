import PricerApi from "@/apis/PricerApi";
import store from "@/store/index.js";

export default class stratHelper {
  constructor(requestedStrat, optData) {
    this.requestedStrat = requestedStrat;
    this.optData = optData;
  }

  strats() {
    return new Array(
      { name: "Risk Reversal 25D", key: "rr25" },
      { name: "Risk Reversal 10D", key: "rr10" },
      { name: "Vega Weighted FLY 25D", key: "fly25" },
      { name: "Vega Weighted FLY 10D", key: "fly10" },
      { name: "Straddle", key: "str" },
      { name: "Strangle 25D", key: "str25" },
      { name: "Strangle 10D", key: "str10" },
      { name: "Call Spread ATM vs 25D", key: "cs" },
      { name: "Call Spread 25D vs 10D", key: "cs25" },
      { name: "PUT Spread ATM vs 25D", key: "ps" },
      { name: "PUT Spread 25D vs 10D", key: "ps25" },
      { name: "Iron Condor", key: "cdr" }
    );
  }

  validateStrategyCreation() {
    let keys = this.strats().map(x => x.key);
    return keys.includes(this.requestedStrat);
  }

  returnValidStrategy() {
    if (this.requestedStrat === "rr25") return this.createRR25();
    if (this.requestedStrat === "rr10") return this.createRR10();
    if (this.requestedStrat === "str") return this.createStraddle();
    if (this.requestedStrat === "str25") return this.createStrangle25();
    if (this.requestedStrat === "str10") return this.createStrangle10();
    if (this.requestedStrat === "cs") return this.createCallSpread();
    if (this.requestedStrat === "cs25") return this.createCallSpread25();
    if (this.requestedStrat === "ps") return this.createPutSpread();
    if (this.requestedStrat === "ps25") return this.createPutSpread25();
    if (this.requestedStrat === "cdr") return this.createIronCondor();
    if (this.requestedStrat === "fly25") return this.createFly25();
    if (this.requestedStrat === "fly10") return this.createFly10();
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
    let leg1 = { ...this.optData };
    leg1.call_put = "PUT";
    leg1.strikeText = "25B";
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
    leg1.strikeText = "10B";
    leg1.notional = "100";
    leg1.name = "1";

    let leg2 = { ...leg1 };
    leg2.call_put = "CALL";
    leg2.name = "2";
    leg2.notional = "100";

    return new Array(leg1, leg2);
  }

  createFly10() {
    let leg1 = { ...this.optData };
    leg1.call_put = "PUT";
    leg1.strikeText = "10B";
    leg1.notional = "225";
    leg1.name = "1";

    let leg2 = { ...leg1 };
    leg2.call_put = "CALL";
    leg2.name = "2";
    leg2.notional = "225";

    let leg3 = { ...leg1 };
    leg3.call_put = "PUT";
    leg3.strikeText = "A";
    leg3.notional = "-100";
    leg3.name = "3";

    let leg4 = { ...leg1 };
    leg4.call_put = "CALL";
    leg4.strikeText = "A";
    leg4.name = "4";
    leg4.notional = "-100";

    return new Array(leg1, leg2, leg3, leg4);
  }

  createFly25() {
    let leg1 = { ...this.optData };
    leg1.call_put = "PUT";
    leg1.strikeText = "25B";
    leg1.notional = "125";
    leg1.name = "1";

    let leg2 = { ...leg1 };
    leg2.call_put = "CALL";
    leg2.name = "2";
    leg2.notional = "125";

    let leg3 = { ...leg1 };
    leg3.call_put = "PUT";
    leg3.strikeText = "A";
    leg3.notional = "-100";
    leg3.name = "3";

    let leg4 = { ...leg1 };
    leg4.call_put = "CALL";
    leg4.strikeText = "A";
    leg4.name = "4";
    leg4.notional = "-100";

    return new Array(leg1, leg2, leg3, leg4);
  }

  createCallSpread25() {
    let leg1 = { ...this.optData };
    leg1.call_put = "CALL";
    leg1.strikeText = "25D";
    leg1.notional = "100";
    leg1.name = "1";

    let leg2 = { ...leg1 };
    leg2.call_put = "CALL";
    leg2.strikeText = "10D";
    leg2.name = "2";
    leg2.notional = "-100";

    return new Array(leg1, leg2);
  }
  createCallSpread() {
    let leg1 = { ...this.optData };
    leg1.call_put = "CALL";
    leg1.strikeText = "A";
    leg1.notional = "100";
    leg1.name = "1";

    let leg2 = { ...leg1 };
    leg2.call_put = "CALL";
    leg2.strikeText = "25D";
    leg2.name = "2";
    leg2.notional = "-100";

    return new Array(leg1, leg2);
  }

  createPutSpread25() {
    let leg1 = { ...this.optData };
    leg1.call_put = "PUT";
    leg1.strikeText = "25D";
    leg1.notional = "100";
    leg1.name = "1";

    let leg2 = { ...leg1 };
    leg2.call_put = "PUT";
    leg2.strikeText = "10D";
    leg2.name = "2";
    leg2.notional = "-100";

    return new Array(leg1, leg2);
  }
  createPutSpread() {
    let leg1 = { ...this.optData };
    leg1.call_put = "PUT";
    leg1.strikeText = "A";
    leg1.notional = "100";
    leg1.name = "1";

    let leg2 = { ...leg1 };
    leg2.call_put = "PUT";
    leg2.strikeText = "25D";
    leg2.name = "2";
    leg2.notional = "-100";

    return new Array(leg1, leg2);
  }

  createIronCondor() {
    let leg1 = { ...this.optData };
    leg1.call_put = "PUT";
    leg1.strikeText = "10D";
    leg1.notional = "100";
    leg1.name = "1";

    let leg2 = { ...leg1 };
    leg2.call_put = "PUT";
    leg2.strikeText = "25D";
    leg2.notional = "-100";
    leg2.name = "2";

    let leg3 = { ...leg1 };
    leg3.call_put = "CALL";
    leg3.strikeText = "25D";
    leg3.notional = "-100";
    leg3.name = "3";

    let leg4 = { ...leg1 };
    leg4.call_put = "CALL";
    leg4.strikeText = "10D";
    leg4.notional = "100";
    leg4.name = "4";

    return new Array(leg1, leg2, leg3, leg4);
  }
}
