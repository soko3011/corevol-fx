export default class stratHelper {
  constructor(requestedStrat, optData) {
    this.requestedStrat = requestedStrat;
    this.optData = optData;
  }

  strats() {
    return new Array("rr25", "rr10", "strad");
  }

  validateStrategyCreation() {
    return this.strats().includes(this.requestedStrat);
  }

  returnValidStrategy() {
    console.log("here");
    if (this.requestedStrat === "rr25") return this.createRR25();
    if (this.requestedStrat === "rr10") return this.createRR10();
    if (this.requestedStrat === "strad") return this.createStrad();
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

  createStrad() {
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
}
