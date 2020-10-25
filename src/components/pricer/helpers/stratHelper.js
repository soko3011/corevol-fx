export default class stratHelper {
  constructor() {}

  createRR(optData) {
    let leg1 = { ...optData };
    leg1.call_put = "PUT";
    leg1.strikeText = "25D";
    leg1.name = "1";

    let leg2 = { ...leg1 };
    leg2.call_put = "CALL";
    leg2.name = "2";
    leg2.notional = "-100";

    return new Array(leg1, leg2);
  }
}
